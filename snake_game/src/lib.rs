use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[derive(Clone)]
struct SnakeCell(usize);

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Clone)]
pub struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(spawn_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_index)],
            direction: Direction::Right,
        }
    }

    fn set_direction(&mut self, direction: Direction) {
        self.direction = direction;
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
    pub fn new(width: usize, snake_idx: usize) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_idx),
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
        let row = snake_index / self.width;
        let col = snake_index % self.width;

        let (row_delta, col_delta) = match self.snake.direction {
            Direction::Up => (-1, 0),
            Direction::Down => (1, 0),
            Direction::Left => (0, (self.width - 1) as i32),
            Direction::Right => (0, 1),
        };

        let new_row = (row as i32 + row_delta).rem_euclid(self.width as i32) as usize;
        let new_col = (col as i32 + col_delta).rem_euclid(self.width as i32) as usize;
        let new_index = new_row * self.width + new_col;

        self.snake.body[0].0 = new_index % self.size;
    }

    pub fn set_snake_direction(&mut self, direction: Direction) {
        self.snake.set_direction(direction);
    }
}
