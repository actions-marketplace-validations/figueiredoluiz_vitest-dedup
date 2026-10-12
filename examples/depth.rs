//! Confirms where the recursion limit actually lives: oxc's parser, not our traversal.
use oxc_allocator::Allocator;
use oxc_parser::Parser;
use oxc_span::SourceType;
fn main() {
    let depth: usize = std::env::args().nth(1).unwrap().parse().unwrap();
    let source = format!(
        "test('x', () => {{ {}1{} }})",
        "(".repeat(depth),
        ")".repeat(depth)
    );
    let allocator = Allocator::new();
    let parsed = Parser::new(&allocator, &source, SourceType::ts()).parse();
    println!(
        "depth {depth}: parsed, fatal={} diagnostics={}",
        parsed.fatal_error,
        parsed.diagnostics.len()
    );
}
