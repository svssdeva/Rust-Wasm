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
    direction: Direction,
    speed: f64,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, snake_idx: usize) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_idx),
            direction: Direction::Right,
            speed: 1.0,
        }
    }
    pub fn get_width(&self) -> usize {
        self.width
    }
    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }
    pub fn update(&mut self, delta_time: f64) {
        let snake_index = self.snake_head();
        let row = snake_index / self.width;
        let col = snake_index % self.width;

        let (row_delta, col_delta) = match self.direction {
            Direction::Up => (-1, 0),
            Direction::Down => (1, 0),
            Direction::Left => (0, -1),
            Direction::Right => (0, 1),
        };

        let new_row = (row as i32 + row_delta) as usize;
        let new_col = (col as i32 + col_delta) as usize;
        let new_index = new_row * self.width + new_col;

        self.snake.body[0].0 = new_index % self.size;
    }

    pub fn set_direction(&mut self, direction: Direction) {
        self.direction = direction;
    }
}
// wasm-pack build --target web
