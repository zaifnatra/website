//! Browser-independent movement and collision for the Loj clearing.
//! World units are metres; camera forward is -Z.
use std::f32::consts::{PI, TAU};
use std::sync::Mutex;

const EYE_HEIGHT: f32 = 1.7;
const PLAYER_RADIUS: f32 = 0.35;
const MAX_STEP: f32 = 0.1;
const OBSTACLES: [(f32, f32, f32, f32); 8] = [
    (-2.0, 2.0, -9.0, -7.0),
    (-6.5, -3.5, -4.3, -3.7),
    (3.6, 6.4, -3.6, -2.4),
    (3.8, 4.2, 2.1, 3.9),
    (4.8, 7.4, -15.6, -12.4), // Tent
    (3.8, 5.2, -11.5, -10.1), // Fire pit
    (6.1, 6.7, -10.7, -10.1), // Coffee stump
    (2.5, 3.5, -12.9, -11.5), // Sitting log
];

fn finite(value: f32) -> f32 { if value.is_finite() { value } else { 0.0 } }
#[derive(Clone, Copy)]
struct Player {
    x: f32,
    z: f32,
    yaw: f32,
    pitch: f32,
    distance: f32,
    bob: f32,
    bob_enabled: bool,
}

impl Player {
    const fn new() -> Self {
        Self { x: 0.0, z: 2.0, yaw: 0.0, pitch: 0.0, distance: 0.0,
            bob: 0.0, bob_enabled: true }
    }
    fn reset(&mut self) {
        let bob_enabled = self.bob_enabled;
        *self = Self::new();
        self.bob_enabled = bob_enabled;
    }
    fn visit_camp(&mut self) {
        self.x = 3.1; self.z = -8.2; self.yaw = TAU - 0.6; self.pitch = -0.25; self.bob = 0.0;
    }
    fn blocked(x: f32, z: f32) -> bool {
        OBSTACLES.iter().any(|&(min_x, max_x, min_z, max_z)| {
            x > min_x - PLAYER_RADIUS && x < max_x + PLAYER_RADIUS
                && z > min_z - PLAYER_RADIUS && z < max_z + PLAYER_RADIUS
        })
    }
    fn tick(&mut self, dt: f32, forward: f32, strafe: f32, sprint: bool, dyaw: f32, dpitch: f32) {
        let dt = finite(dt).clamp(0.0, 0.1);
        self.yaw = (self.yaw + finite(dyaw).clamp(-PI, PI)).rem_euclid(TAU);
        self.pitch = (self.pitch + finite(dpitch).clamp(-PI, PI)).clamp(-1.35, 1.35);
        let forward = finite(forward).clamp(-1.0, 1.0);
        let strafe = finite(strafe).clamp(-1.0, 1.0);
        let length = (forward * forward + strafe * strafe).sqrt().max(1.0);
        let speed = if sprint { 4.8 } else { 2.4 };
        let dx = (-self.yaw.sin() * forward + self.yaw.cos() * strafe) / length * speed * dt;
        let dz = (-self.yaw.cos() * forward - self.yaw.sin() * strafe) / length * speed * dt;
        let steps = ((dx * dx + dz * dz).sqrt() / MAX_STEP).ceil().max(1.0) as u32;
        let mut travelled = 0.0;
        for _ in 0..steps {
            let before = (self.x, self.z);
                let next_x = (self.x + dx / steps as f32).clamp(-9.0, 9.0);
                if !Self::blocked(next_x, self.z) { self.x = next_x; }
                let next_z = (self.z + dz / steps as f32).clamp(-19.0, 9.0);
                if !Self::blocked(self.x, next_z) { self.z = next_z; }
            travelled += ((self.x - before.0).powi(2) + (self.z - before.1).powi(2)).sqrt();
        }
        self.distance += travelled;
        let target_bob = if self.bob_enabled && travelled > 0.0001 {
            (self.distance * 9.0).sin() * 0.018
        } else { 0.0 };
        self.bob += (target_bob - self.bob) * (dt * 14.0).min(1.0);
    }
    fn eye_height(&self) -> f32 {
        EYE_HEIGHT + self.bob
    }
}

static PLAYER: Mutex<Player> = Mutex::new(Player::new());
#[no_mangle]
pub extern "C" fn reset() {
    let mut player = PLAYER.lock().unwrap();
    player.reset();
}
#[no_mangle]
pub extern "C" fn visit_camp() { PLAYER.lock().unwrap().visit_camp(); }
#[no_mangle]
pub extern "C" fn tick(dt: f32, forward: f32, strafe: f32, sprint: u32, yaw_delta: f32, pitch_delta: f32) {
    PLAYER.lock().unwrap().tick(dt, forward, strafe, sprint != 0, yaw_delta, pitch_delta);
}
#[no_mangle]
pub extern "C" fn set_bob(enabled: u32) {
    let mut player = PLAYER.lock().unwrap();
    player.bob_enabled = enabled != 0;
    if !player.bob_enabled { player.bob = 0.0; }
}
#[no_mangle]
pub extern "C" fn get_x() -> f32 { PLAYER.lock().unwrap().x }
#[no_mangle]
pub extern "C" fn get_y() -> f32 { PLAYER.lock().unwrap().eye_height() }
#[no_mangle]
pub extern "C" fn get_z() -> f32 { PLAYER.lock().unwrap().z }
#[no_mangle]
pub extern "C" fn get_yaw() -> f32 { PLAYER.lock().unwrap().yaw }
#[no_mangle]
pub extern "C" fn get_pitch() -> f32 { PLAYER.lock().unwrap().pitch }
#[no_mangle]
pub extern "C" fn get_distance() -> f32 { PLAYER.lock().unwrap().distance }
#[cfg(test)]
mod tests {
    use super::*;
    fn walk(player: &mut Player, seconds: u32, forward: f32, strafe: f32) {
        for _ in 0..seconds * 60 { player.tick(1.0 / 60.0, forward, strafe, false, 0.0, 0.0); }
    }
    #[test]
    fn clearing_speed_and_diagonal_normalization() {
        let mut straight = Player::new(); let mut diagonal = Player::new();
        walk(&mut straight, 1, 1.0, 0.0); walk(&mut diagonal, 1, 1.0, 1.0);
        assert!((straight.z + 0.4).abs() < 0.001);
        assert!((diagonal.distance - straight.distance).abs() < 0.001);
    }
    #[test]
    fn movement_rotates_with_camera() {
        let mut player = Player::new(); player.yaw = PI / 2.0;
        walk(&mut player, 1, 1.0, 0.0);
        assert!((player.x + 2.4).abs() < 0.001);
        assert!((player.z - 2.0).abs() < 0.001);
    }
    #[test]
    fn register_blocks_but_allows_sliding() {
        let mut player = Player::new(); walk(&mut player, 20, 1.0, 0.0);
        assert!(player.z >= -6.65 && player.z < -6.5);
        walk(&mut player, 2, 1.0, 1.0);
        assert!(player.x > 3.0 && player.z < -6.65);
    }
    #[test]
    fn frame_hitches_do_not_tunnel() {
        let mut player = Player::new(); player.z = -6.5;
        player.tick(100.0, 1.0, 0.0, true, 0.0, 0.0);
        assert!(player.z >= -6.65);
    }
    #[test]
    fn invalid_inputs_and_pitch_are_contained() {
        let mut player = Player::new();
        player.tick(f32::NAN, f32::INFINITY, f32::NAN, true, f32::NAN, f32::INFINITY);
        assert_eq!((player.x, player.z, player.yaw), (0.0, 2.0, 0.0));
        player.tick(0.0, 0.0, 0.0, false, 1000.0, 1000.0);
        assert!(player.pitch <= 1.35 && player.yaw >= 0.0 && player.yaw < TAU);
    }
    #[test]
    fn clearing_has_finite_bounds() {
        let mut player = Player::new(); player.z = 0.0;
        walk(&mut player, 100, 0.0, 1.0); assert_eq!(player.x, 9.0);
        walk(&mut player, 100, -1.0, 0.0); assert_eq!(player.z, 9.0);
        walk(&mut player, 100, 1.0, 0.0); assert_eq!(player.z, -19.0);
    }
    #[test]
    fn each_clearing_object_blocks_both_sides() {
        for &(min_x, max_x, min_z, max_z) in &OBSTACLES {
            let mut front = Player::new(); front.x = (min_x + max_x) / 2.0; front.z = max_z + 0.5;
            walk(&mut front, 2, 1.0, 0.0);
            assert!(front.z >= max_z + PLAYER_RADIUS && front.z < max_z + PLAYER_RADIUS + 0.1);
            let mut back = Player::new(); back.x = (min_x + max_x) / 2.0; back.z = min_z - 0.5;
            walk(&mut back, 2, -1.0, 0.0);
            assert!(back.z <= min_z - PLAYER_RADIUS && back.z > min_z - PLAYER_RADIUS - 0.1);
        }
    }
    #[test]
    fn campsite_arrival_is_safe_and_preserves_preferences() {
        let mut player = Player::new(); player.bob_enabled = false; player.distance = 12.0;
        player.visit_camp();
        assert!(!Player::blocked(player.x, player.z));
        assert!(!player.bob_enabled); assert_eq!(player.distance, 12.0);
        walk(&mut player, 1, 1.0, 0.0);
        assert!(!Player::blocked(player.x, player.z));
        player.reset(); assert_eq!((player.x, player.z), (0.0, 2.0));
    }
    #[test]
    fn reset_preserves_reduced_motion() {
        let mut player = Player::new(); player.bob_enabled = false;
        walk(&mut player, 1, 1.0, 0.0); assert_eq!(player.bob, 0.0);
        player.reset(); assert!(!player.bob_enabled);
        assert_eq!(player.z, 2.0); assert_eq!(player.distance, 0.0);
    }
}
