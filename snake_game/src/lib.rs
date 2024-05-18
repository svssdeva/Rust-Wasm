use js_sys::Math;
use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[derive(Clone, Copy, PartialEq)]
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
    fn new(spawn_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_index)],
            direction: Direction::Right,
        }
    }

    fn set_direction(&mut self, direction: Direction) {
        self.direction = direction;
    }

    fn move_snake(&mut self, head_index: usize) {
        self.body.insert(0, SnakeCell(head_index));
    }

    fn grow_snake(&mut self) {
        let tail_index = self.body.last().unwrap().0;
        self.body.push(SnakeCell(tail_index));
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
    food: Option<usize>,
    score: usize,
    game_over: bool,
    direction: Option<Direction>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, snake_idx: usize) -> World {
        let snake_idx = (Math::random() * ((width * width) as f64)) as usize;
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_idx),
            food: None,
            score: 0,
            game_over: false,
            direction: None,
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn food_position(&self) -> Option<usize> {
        self.food
    }

    pub fn score(&self) -> usize {
        self.score
    }

    pub fn game_over(&self) -> bool {
        self.game_over
    }

    pub fn update(&mut self) {
        if self.game_over {
            return;
        }

        if let Some(direction) = self.direction {
            let snake_index = self.snake_head();
            let row = snake_index / self.width;
            let col = snake_index % self.width;

            let (row_delta, col_delta) = match direction {
                Direction::Up => (-1, 0),
                Direction::Down => (1, 0),
                Direction::Left => (0, -1),
                Direction::Right => (0, 1),
            };

            let new_row = (row as i32 + row_delta).rem_euclid(self.width as i32) as usize;
            let new_col = (col as i32 + col_delta).rem_euclid(self.width as i32) as usize;

            let new_index = new_row * self.width + new_col;

            if self.snake.body[1..].contains(&SnakeCell(new_index)) {
                self.game_over = true;
                return;
            }

            self.snake.body.insert(0, SnakeCell(new_index));

            if let Some(food_index) = self.food {
                if food_index == new_index {
                    self.score += 1;
                    self.food = None;
                } else {
                    self.snake.body.pop();
                }
            } else {
                self.snake.body.pop();
            }
        }
    }

    #[wasm_bindgen]
    pub fn spawn_food(&mut self) {
        let mut food_index;
        loop {
            food_index = (Math::random() * (self.size as f64)) as usize;
            if !self.snake.body.contains(&SnakeCell(food_index)) {
                break;
            }
        }
        self.food = Some(food_index);
    }

    pub fn set_snake_direction(&mut self, direction: Direction) {
        if self.game_over {
            return;
        }

        if let Some(current_direction) = self.direction {
            match (current_direction, direction) {
                (Direction::Up, Direction::Down)
                | (Direction::Down, Direction::Up)
                | (Direction::Left, Direction::Right)
                | (Direction::Right, Direction::Left) => return,
                _ => (),
            }
        }

        self.direction = Some(direction);
    }

    pub fn reset(&mut self) {
        let snake_idx = (Math::random() * ((self.width * self.width) as f64)) as usize;
        self.snake = Snake::new(snake_idx);
        self.food = None;
        self.score = 0;
        self.game_over = false;
        self.direction = None;
    }

    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }
}
