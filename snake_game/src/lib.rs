use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct World {
    pub width: usize,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new() -> World {
        World { width: 8 }
    }
    pub fn get_width(&self) -> usize {
        self.width
    }
}

// wasm-pack build --target web
