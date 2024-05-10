fn main() {
    let message = "Hello, World!";
    print_snake(message);
}

fn print_snake(text: &str) -> &str {
    println!("{}", text);
    return text;
}
