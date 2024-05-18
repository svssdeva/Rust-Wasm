use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[derive(Clone)]
pub struct SnakeCell(usize);

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
    fn new(spawn_index: usize, size: usize) -> Snake {
        let mut body = vec![];
        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Snake {
            body,
            direction: Direction::Right,
        }
    }

    fn set_direction(&mut self, direction: Direction) {
        self.direction = direction;
    }

    fn move_snake(&mut self, head_index: usize) {
        for i in (1..self.body.len()).rev() {
            self.body[i].0 = self.body[i - 1].0;
        }
        self.body[0].0 = head_index;
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
            snake: Snake::new(snake_idx, 3),
        }
    }
    pub fn get_width(&self) -> usize {
        self.width
    }
    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }
    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }
    pub fn update(&mut self) {
        let snake_index = self.snake_head();
        let row = snake_index / self.width;
        let col = snake_index % self.width;

        let (row_delta, col_delta) = match self.snake.direction {
            Direction::Up => (-1, 0),
            Direction::Down => (1, 0),
            Direction::Left => (0, -1),
            Direction::Right => (0, 1),
        };

        let new_row = (row as i32 + row_delta) as usize;
        let new_col = (col as i32 + col_delta) as usize;

        if new_row < self.width && new_col < self.width {
            let new_index = new_row * self.width + new_col;
            self.snake.move_snake(new_index);
        } else {
            // Snake has reached the boundary, keep the same direction
            let new_index = match self.snake.direction {
                Direction::Up => ((self.width - 1) * self.width) + col,
                Direction::Down => col,
                Direction::Left => row * self.width + (self.width - 1),
                Direction::Right => row * self.width,
            };
            self.snake.move_snake(new_index);
        }
    }

    pub fn set_snake_direction(&mut self, direction: Direction) {
        // Prevent the snake from moving in the opposite direction
        match (self.snake.direction, direction) {
            (Direction::Up, Direction::Down)
            | (Direction::Down, Direction::Up)
            | (Direction::Left, Direction::Right)
            | (Direction::Right, Direction::Left) => return,
            _ => self.snake.set_direction(direction),
        }
    }
    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }
}
