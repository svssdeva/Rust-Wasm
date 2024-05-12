use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[derive(Clone)]
struct SnakeCell(usize);

#[derive(Clone)]
pub struct Snake {
    body: Vec<SnakeCell>,
}

impl Snake {
    fn new(spawn_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_index)],
        }
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new() -> World {
        let width = 8;
        World {
            width,
            size: width * width,
            snake: Snake::new(10),
        }
    }
    pub fn get_width(&self) -> usize {
        self.width
    }
    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }
    pub fn update(&mut self) {
        let snake_index = self.snake_head();
        self.snake.body[0].0 = (snake_index - 1) % self.size;
    }
}
// wasm-pack build --target web
