use assert_cmd::Command;
use std::path::Path;
use vitest_dedup::model::Rule;

const HELPER: &str = "import { test, expect } from 'vitest';\nexport function run() {\n  test('first', () => { expect('helper source marker').toBe('helper source marker'); });\n  test('second', () => { expect('helper source marker').toBe('helper source marker'); });\n}\n";

/// Writes a first-party runner with two declarations and a caller that registers them twice.
fn fixture() -> tempfile::TempDir {
    let directory = tempfile::tempdir().unwrap();
    std::fs::write(directory.path().join("runner.ts"), HELPER).unwrap();
    std::fs::write(
        directory.path().join("caller.test.ts"),
        "import { run } from './runner'; run(); run();",
    )
    .unwrap();
    directory
}

/// Runs the standalone analyzer with a deterministic JSON report and selected duplicate rule.
fn command(root: &Path) -> Command {
    let mut command = Command::cargo_bin("vitest-dedup").unwrap();
    command.arg(root);
    for rule in Rule::ALL {
        command.args([
            "--rule",
            &format!(
                "{}={}",
                rule.id(),
                if *rule == Rule::DuplicateTest {
                    "error"
                } else {
                    "off"
                }
            ),
        ]);
    }
    command
}

/// Reads the analyzer's JSON report from the isolated fixture root.
fn report(root: &Path) -> serde_json::Value {
    serde_json::from_str(&std::fs::read_to_string(root.join("report.json")).unwrap()).unwrap()
}

#[test]
/// Requires helper source bytes to drive HTML snippets and inline suppression decisions.
fn imported_helper_sources_supply_html_snippets_and_source_suppressions() {
    let directory = fixture();
    let root = directory.path();
    command(root)
        .args(["--reporters", "json,html", "--output"])
        .arg(root.join("report"))
        .assert()
        .code(1);
    let first = report(root);
    assert_eq!(first["testsAnalyzed"], 4);
    assert_eq!(first["findings"].as_array().unwrap().len(), 1);
    assert_eq!(first["findings"][0]["locations"][0]["path"], "runner.ts");
    assert_eq!(
        first["findings"][0]["registrationFiles"][0][0],
        "caller.test.ts"
    );
    let html = std::fs::read_to_string(root.join("report.html")).unwrap();
    assert!(
        html.contains("helper source marker"),
        "the snippet must come from the undiscovered helper source"
    );
    let suppressed = HELPER.replace(
        "  test('first'",
        "  // vitest-dedup-disable-next-line owned intentional pair\n  test('first'",
    );
    std::fs::write(root.join("runner.ts"), suppressed).unwrap();
    command(root)
        .args(["--reporters", "json", "--output"])
        .arg(root.join("report"))
        .assert()
        .success();
    let second = report(root);
    assert_eq!(second["testsAnalyzed"], 4);
    assert_eq!(second["findings"].as_array().unwrap().len(), 0);
    assert_eq!(second["modes"]["suppressionsApplied"], 1);
}

#[test]
/// Requires current file baselines to retain imported declaration/caller identity.
fn imported_findings_roundtrip_through_a_current_file_baseline() {
    let directory = fixture();
    let root = directory.path();
    let baseline = root.join("baseline.json");
    command(root)
        .arg("--baseline")
        .arg(&baseline)
        .arg("--update-baseline")
        .assert()
        .success();
    command(root)
        .arg("--baseline")
        .arg(&baseline)
        .args(["--reporters", "json", "--output"])
        .arg(root.join("report"))
        .assert()
        .success();
    let result = report(root);
    assert_eq!(result["testsAnalyzed"], 4);
    assert_eq!(result["findings"].as_array().unwrap().len(), 1);
    assert_eq!(result["findings"][0]["baselined"], true);
    assert_eq!(result["modes"]["baselined"], 1);
}

#[test]
/// Keeps mixed successful/refused extraction incomplete and prevents baseline updates.
fn an_extracted_and_refused_file_remains_incomplete_and_cannot_update_a_baseline() {
    let directory = fixture();
    let root = directory.path();
    std::fs::write(
        root.join("caller.test.ts"),
        "import { run } from './runner'; run(); run(setup());",
    )
    .unwrap();
    command(root)
        .args(["--reporters", "json", "--output"])
        .arg(root.join("report"))
        .arg("--fail-on-incomplete")
        .assert()
        .code(2);
    let result = report(root);
    assert_eq!(result["testsAnalyzed"], 2);
    assert_eq!(result["findings"].as_array().unwrap().len(), 0);
    assert_eq!(result["incomplete"], true);
    assert_eq!(result["unresolvedTests"], 2);
    command(root)
        .arg("--baseline")
        .arg(root.join("baseline.json"))
        .arg("--update-baseline")
        .assert()
        .code(2);
    assert!(!root.join("baseline.json").exists());
}

/// Runs fixture Git commands without inheriting another repository's Git environment.
fn git(root: &Path, args: &[&str]) {
    let output = std::process::Command::new("git")
        .current_dir(root)
        .env_remove("GIT_DIR")
        .env_remove("GIT_WORK_TREE")
        .env_remove("GIT_INDEX_FILE")
        .env_remove("GIT_OBJECT_DIRECTORY")
        .env_remove("GIT_ALTERNATE_OBJECT_DIRECTORIES")
        .env_remove("GIT_CEILING_DIRECTORIES")
        .env_remove("GIT_COMMON_DIR")
        .env_remove("GIT_PREFIX")
        .args(args)
        .output()
        .unwrap();
    assert!(
        output.status.success(),
        "{}",
        String::from_utf8_lossy(&output.stderr)
    );
}

#[test]
/// Requires partial historical baselines and changed-caller inclusion for helper findings.
fn a_revision_baseline_is_partial_and_a_changed_caller_keeps_helper_findings() {
    let directory = fixture();
    let root = directory.path();
    git(root, &["init", "--quiet"]);
    git(root, &["add", "."]);
    git(
        root,
        &[
            "-c",
            "user.name=Owned fixture",
            "-c",
            "user.email=fixture@example.test",
            "commit",
            "--quiet",
            "-m",
            "owned baseline",
        ],
    );
    std::fs::write(
        root.join("caller.test.ts"),
        "import { run } from './runner'; run();",
    )
    .unwrap();
    command(root)
        .args(["--changed-since", "HEAD", "--reporters", "json", "--output"])
        .arg(root.join("report"))
        .assert()
        .code(1);
    let changed = report(root);
    assert_eq!(changed["testsAnalyzed"], 2);
    assert_eq!(changed["findings"].as_array().unwrap().len(), 1);
    assert_eq!(changed["findings"][0]["locations"][0]["path"], "runner.ts");
    assert_eq!(changed["modes"]["withheldUnchanged"], 0);
    let output = command(root)
        .args([
            "--baseline-from-ref",
            "HEAD",
            "--reporters",
            "json",
            "--output",
        ])
        .arg(root.join("report"))
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(1));
    assert!(String::from_utf8(output.stderr)
        .unwrap()
        .contains("baseline may be partial"));
    let baseline = report(root);
    assert_eq!(baseline["testsAnalyzed"], 2);
    assert_eq!(baseline["findings"].as_array().unwrap().len(), 1);
    assert_eq!(baseline["findings"][0]["baselined"], false);
}

/// Runs a caller beside a one-hook runner with only `redundant-hook` enabled; returns the report.
fn redundant_hook_report(helper_hook: &str, caller_hook: &str) -> serde_json::Value {
    let directory = tempfile::tempdir().unwrap();
    let root = directory.path();
    std::fs::write(
        root.join("runner.ts"),
        format!("import {{ beforeEach }} from 'vitest';\nexport function install() {{\n  beforeEach(() => {{ {helper_hook} }});\n}}\n"),
    )
    .unwrap();
    std::fs::write(
        root.join("caller.test.ts"),
        format!("import {{ beforeEach, test, expect }} from 'vitest'; import {{ install }} from './runner';\ninstall();\nbeforeEach(() => {{ {caller_hook} }});\ntest('a', () => {{ expect(1).toBe(1); }});\n"),
    )
    .unwrap();
    let mut command = Command::cargo_bin("vitest-dedup").unwrap();
    command.arg(root);
    for rule in Rule::ALL {
        let level = if *rule == Rule::RedundantHook {
            "warning"
        } else {
            "off"
        };
        command.args(["--rule", &format!("{}={level}", rule.id())]);
    }
    command
        .args(["--reporters", "json", "--output"])
        .arg(root.join("report"))
        .assert()
        .code(predicates::prelude::predicate::in_iter([0, 1]));
    report(root)
}

#[test]
/// A helper-installed hook equal to a caller hook is reported against the helper's own location;
/// a different hook body is not.
fn imported_hooks_take_part_in_redundant_hook_comparison() {
    let same = redundant_hook_report("globalThis.ready = true;", "globalThis.ready = true;");
    assert_eq!(same["testsAnalyzed"], 1);
    assert_eq!(same["incomplete"], false);
    let findings = same["findings"].as_array().unwrap();
    assert_eq!(findings.len(), 1, "{same}");
    let paths: Vec<_> = findings[0]["locations"]
        .as_array()
        .unwrap()
        .iter()
        .map(|location| location["path"].as_str().unwrap())
        .collect();
    assert!(
        paths.contains(&"runner.ts") && paths.contains(&"caller.test.ts"),
        "{paths:?}"
    );
    let different = redundant_hook_report("globalThis.ready = true;", "globalThis.other = false;");
    assert_eq!(
        different["findings"].as_array().unwrap().len(),
        0,
        "{different}"
    );
}
