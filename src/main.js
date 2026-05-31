import Phaser from 'phaser';

const VIEW_W = 1280;
const VIEW_H = 960;
const WORLD_W = 3200;
const WORLD_H = 2400;

const COLORS = {
  grass: 0x2b6a3a, grassDark: 0x224d2c, clearing: 0x3a824c,
  trunk: 0x4b2e1a, leavesA: 0x1f5a2c, leavesB: 0x2a7238, leavesC: 0x174a23,
  bush: 0x2f8040, river: 0x2f6fa8, riverDeep: 0x234f7a,
};

const ANIMAL_TYPES = {
  rabbit:   { body: 0xd9d2c4, belly: 0xffffff, radius: 7,  speed: 160, label: 'coelho',          desc: 'salto longo',        ability: 'jump',   cooldown: 1400, eats: [],           scare: { name: 'patada',   range: 70,  push: 90,  stun: 800 } },
  owl:      { body: 0x6b4e2e, belly: 0xd9bf90, radius: 8,  speed: 150, label: 'coruja',          desc: 'voo invulnerável',   ability: 'flight', cooldown: 6000, eats: [],           scare: { name: 'mergulho', range: 110, push: 160, stun: 1500 } },
  fox:      { body: 0xe06a2a, belly: 0xf4d7b0, radius: 10, speed: 140, label: 'raposa',          desc: 'dash rápido',        ability: 'dash',   cooldown: 2000, eats: ['rabbit'],   scare: { name: 'mordida',  range: 80,  push: 110, stun: 1200 } },
  deer:     { body: 0x8b5a2b, belly: 0xe9c99d, radius: 12, speed: 130, label: 'veado',           desc: 'corrida longa',      ability: 'sprint', cooldown: 4000, eats: [],           scare: { name: 'coice',    range: 100, push: 180, stun: 1800 } },
  boar:     { body: 0xc9a672, belly: 0xe8d5a8, radius: 9,  speed: 125, label: 'cão-da-pradaria', desc: 'disparada',          ability: 'charge', cooldown: 4000, eats: ['owl'],      scare: { name: 'dentada',  range: 90,  push: 170, stun: 1800 } },
  bear:     { body: 0x3a2a1c, belly: 0x5a4430, radius: 16, speed: 90,  label: 'urso',            desc: 'rugido que atordoa', ability: 'roar',   cooldown: 5000, eats: ['deer'],     scare: { name: 'patada',   range: 130, push: 220, stun: 2500 } },
  capybara: { body: 0x6e4a2c, belly: 0x9a7448, radius: 13, speed: 100, label: 'capivara',        desc: 'nado rápido na água',ability: 'sprint', cooldown: 4500, eats: [],           scare: { name: 'mordida',  range: 90,  push: 130, stun: 1400 } },
  jaguar:   { body: 0xd4a04c, belly: 0xf5dfa0, radius: 14, speed: 155, label: 'onça-pintada',    desc: 'bote fatal',         ability: 'charge', cooldown: 3500, eats: ['capybara'], scare: { name: 'bote',     range: 130, push: 240, stun: 2600 } },
  tucano:   { body: 0x101010, belly: 0xffffff, radius: 10, speed: 150, label: 'tucano',          desc: 'voo invulnerável',   ability: 'flight', cooldown: 5500, eats: [],           scare: { name: 'bicada',   range: 95,  push: 140, stun: 1400 } },
  cobra:    { body: 0x2a7a2a, belly: 0xe6d27a, radius: 9,  speed: 135, label: 'cobra',           desc: 'bote venenoso',      ability: 'charge', cooldown: 3200, eats: ['tucano'],   scare: { name: 'bote',     range: 85,  push: 150, stun: 1700 } },
  rato:     { body: 0x8a8278, belly: 0xd8cfc0, radius: 6,  speed: 165, label: 'rato',            desc: 'corrida ligeira',    ability: 'sprint', cooldown: 3800, eats: [],           scare: { name: 'mordidinha', range: 55, push: 70,  stun: 700 } },
  gato:     { body: 0xb58a4c, belly: 0xebcd95, radius: 12, speed: 150, label: 'gato-do-mato',    desc: 'bote ágil',          ability: 'charge', cooldown: 3200, eats: ['rato'],     scare: { name: 'bote',     range: 105, push: 180, stun: 1800 } },

  // --- novos fugitivos (presas) ---
  zebra:    { body: 0xf2f2f2, belly: 0xffffff, radius: 12, speed: 150, label: 'zebra',           desc: 'corrida em manada',  ability: 'sprint', cooldown: 4000, eats: [],          scare: { name: 'coice',   range: 100, push: 180, stun: 1700 } },
  macaco:   { body: 0x7a5230, belly: 0xe8c89a, radius: 9,  speed: 158, label: 'macaco',          desc: 'salto entre galhos', ability: 'jump',   cooldown: 1400, eats: [],          scare: { name: 'tapa',    range: 70,  push: 100, stun: 1000 } },
  tatu:     { body: 0x9a8a6a, belly: 0xcabfa0, radius: 9,  speed: 120, label: 'tatu',             desc: 'cavar: some por 2s',  ability: 'dig',    cooldown: 6000, eats: [],          scare: { name: 'rolada',  range: 75,  push: 120, stun: 1200 } },

  // --- novos predadores ---
  leao:     { body: 0xd6a44c, belly: 0xeccf93, radius: 15, speed: 145, label: 'leão',            desc: 'rugido que atordoa', ability: 'roar',   cooldown: 5000, eats: ['zebra'],  scare: { name: 'patada',  range: 130, push: 220, stun: 2400 } },
  tigre:    { body: 0xe0852a, belly: 0xf4d7b0, radius: 15, speed: 152, label: 'tigre',           desc: 'bote feroz',         ability: 'charge', cooldown: 3400, eats: ['macaco'], scare: { name: 'bote',    range: 130, push: 230, stun: 2500 } },
  hiena:    { body: 0x9a8460, belly: 0xc8b890, radius: 12, speed: 150, label: 'hiena',           desc: 'disparada em bando', ability: 'dash',   cooldown: 2200, eats: ['tatu'],   scare: { name: 'mordida', range: 100, push: 170, stun: 1700 } },
};

function canEat(a, b) {
  return a !== b && a.spec.eats.includes(b.type);
}

const BASES = [
  { type: 'rabbit',   x: 520,  y: 360,  radius: 140 },
  { type: 'owl',      x: 2680, y: 360,  radius: 140 },
  { type: 'capybara', x: 1600, y: 420,  radius: 160 },
  { type: 'fox',      x: 520,  y: 1020, radius: 140 },
  { type: 'deer',     x: 2680, y: 1020, radius: 140 },
  { type: 'boar',     x: 520,  y: 2040, radius: 140 },
  { type: 'bear',     x: 2680, y: 2040, radius: 140 },
  { type: 'jaguar',   x: 1600, y: 2040, radius: 140 },
  { type: 'tucano',   x: 1600, y: 1020, radius: 140 },
  { type: 'cobra',    x: 2100, y: 1700, radius: 140 },
  { type: 'rato',     x: 1050, y: 1700, radius: 130 },
  { type: 'gato',     x: 2100, y: 420,  radius: 140 },
  { type: 'zebra',    x: 1050, y: 360,  radius: 150 },
  { type: 'macaco',   x: 1050, y: 1020, radius: 140 },
  { type: 'tatu',     x: 2100, y: 1020, radius: 140 },
  { type: 'leao',     x: 350,  y: 1600, radius: 150 },
  { type: 'tigre',    x: 2850, y: 1380, radius: 150 },
  { type: 'hiena',    x: 1600, y: 1380, radius: 140 },
];

const PREDATORS_OF = {};
for (const [type, spec] of Object.entries(ANIMAL_TYPES)) {
  for (const prey of spec.eats) {
    if (!PREDATORS_OF[prey]) PREDATORS_OF[prey] = [];
    PREDATORS_OF[prey].push(type);
  }
}

function baseFor(type) {
  return BASES.find((b) => b.type === type);
}

const PASSAGE_OFFSET_Y = 165;
const PASSAGE_RADIUS = 30;
function passagePos(base) {
  return { x: base.x, y: base.y + PASSAGE_OFFSET_Y };
}

function isInWater(x, y) {
  if (x < 0 || x > WORLD_W) return false;
  const t = x / WORLD_W;
  const cy = WORLD_H * 0.55 + Math.sin(t * 6) * 160 + Math.cos(t * 3) * 60;
  return Math.abs(y - cy) <= 70;
}

function enforceBases(animal) {
  for (const base of BASES) {
    const preds = PREDATORS_OF[base.type] || [];
    if (!preds.includes(animal.type)) continue;
    const dx = animal.x - base.x;
    const dy = animal.y - base.y;
    const d = Math.hypot(dx, dy);
    const needed = base.radius + animal.spec.radius;
    if (d < needed) {
      const nx = dx / (d || 1);
      const ny = dy / (d || 1);
      animal.x = base.x + nx * needed;
      animal.y = base.y + ny * needed;
    }
  }
}

class Animal {
  constructor(scene, type, x, y, isPlayer = false) {
    this.scene = scene;
    this.type = type;
    this.spec = ANIMAL_TYPES[type];
    this.isPlayer = isPlayer;
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.dead = false;

    this.speedMult = 1;
    this.speedMultUntil = 0;
    this.stunnedUntil = 0;
    this.invulnerableUntil = 0;
    this.contactEats = false;
    this.contactEatsUntil = 0;
    this.alertedUntil = 0;
    this.alertSourceX = 0;
    this.alertSourceY = 0;
    this.helpingUntil = 0;
    this.attackReadyAt = 0;
    this.luredUntil = 0;
    this.slowedUntil = 0;
    this.isHidden = false;
    this.invisibleUntil = 0;
    this.digUntil = 0;
    this.lastDigMark = 0;

    this.container = scene.add.container(x, y);
    this.body = scene.add.graphics();
    this.container.add(this.body);
    this.draw();

    this.label = scene.add.text(0, -this.spec.radius - 14, isPlayer ? `você (${this.spec.label})` : this.spec.label, {
      fontFamily: 'system-ui, sans-serif', fontSize: '16px',
      color: isPlayer ? '#ffd966' : '#e6e6e6',
    }).setOrigin(0.5);
    this.container.add(this.label);

    this.alertMark = scene.add.text(0, -this.spec.radius - 28, '!', {
      fontFamily: 'system-ui, sans-serif', fontSize: '24px',
      color: '#ff4d4d', fontStyle: 'bold',
    }).setOrigin(0.5).setVisible(false);
    this.container.add(this.alertMark);

    this.wanderTimer = 0;
    this.wanderDir = { x: 0, y: 0 };
    this.npcAbilityReadyAt = 1000 + Math.random() * 3000;
    this.npcHelpReadyAt = 0;
    this.npcAlertReadyAt = 0;
    this.helpTargetAnimal = null;
    this.helpTargetType = null;
    this.pickNewWander();
  }

  get speed() {
    return this.scene.speedOverride ?? this.spec.speed;
  }

  draw() {
    const g = this.body;
    g.clear();
    drawAnimalShape(g, this.type, 0, 0, 1);
  }

  pickNewWander() {
    const a = Math.random() * Math.PI * 2;
    const move = Math.random() < 0.65;
    this.wanderDir = move ? { x: Math.cos(a), y: Math.sin(a) } : { x: 0, y: 0 };
    this.wanderTimer = 1200 + Math.random() * 2500;
  }

  setPosition(x, y) {
    this.x = Phaser.Math.Clamp(x, 20, WORLD_W - 20);
    this.y = Phaser.Math.Clamp(y, 20, WORLD_H - 20);
    enforceBases(this);
  }

  sync(now) {
    this.container.setPosition(this.x, this.y);
    const giant = now < (this.giantUntil || 0);
    const s = giant ? 2.5 : 1;
    this.container.setScale(this.facing * s, s);
    this.label.setScale(this.facing, 1);
    this.container.setDepth(this.y);
    const invuln = now < this.invulnerableUntil;
    const invisible = now < (this.invisibleUntil || 0);
    this.container.setAlpha(invisible ? 0.12 : (invuln ? 0.5 : (this.isHidden ? 0.6 : 1)));
    this.alertMark.setVisible(now < this.alertedUntil);
    this.alertMark.setScale(this.facing, 1);
  }

  updateNpc(delta, now, player) {
    if (this.dead) return;
    if (now < this.stunnedUntil) { this.sync(now); return; }

    if (now < this.luredUntil) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const d = Math.hypot(dx, dy);
      if (d > 8) {
        const nx = dx / d, ny = dy / d;
        const mult = 1.3;
        this.setPosition(
          this.x + nx * this.speed * mult * (delta / 1000),
          this.y + ny * this.speed * mult * (delta / 1000),
        );
        this.facing = nx >= 0 ? 1 : -1;
      }
      this.sync(now);
      return;
    }

    if (now < this.helpingUntil) {
      const target = this.helpTargetAnimal && !this.helpTargetAnimal.dead ? this.helpTargetAnimal : player;
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const d = Math.hypot(dx, dy);
      if (d > 40) {
        const nx = dx / d, ny = dy / d;
        const mult = 1.5;
        this.setPosition(
          this.x + nx * this.speed * mult * (delta / 1000),
          this.y + ny * this.speed * mult * (delta / 1000),
        );
        this.facing = nx >= 0 ? 1 : -1;
      }
      if (now >= this.attackReadyAt) {
        this.scene.performScare(this, now, this.helpTargetType || player.type);
        this.attackReadyAt = now + 1000;
      }
      this.sync(now);
      return;
    }

    if (now < this.alertedUntil) {
      const sdx = this.x - this.alertSourceX;
      const sdy = this.y - this.alertSourceY;
      const sd = Math.hypot(sdx, sdy);
      if (sd > 0.001) {
        const nx = sdx / sd, ny = sdy / sd;
        const mult = 1.4;
        this.setPosition(
          this.x + nx * this.speed * mult * (delta / 1000),
          this.y + ny * this.speed * mult * (delta / 1000),
        );
        this.facing = nx >= 0 ? 1 : -1;
      }
      this.sync(now);
      return;
    }

    this.wanderTimer -= delta;
    if (this.wanderTimer <= 0) this.pickNewWander();

    let vx = this.wanderDir.x, vy = this.wanderDir.y;

    let nearestThreat = null, threatDist = Infinity;
    let nearestPrey = null, preyDist = Infinity;
    for (const other of this.scene.animals) {
      if (other === this || other.dead) continue;
      const odx = other.x - this.x;
      const ody = other.y - this.y;
      const d = Math.hypot(odx, ody);
      if (d > 220) continue;
      if (now < (other.invisibleUntil || 0)) continue;
      if (other.isHidden && d > 60) continue;
      if (other.spec.eats.includes(this.type) && d < threatDist) {
        nearestThreat = other; threatDist = d;
      } else if (this.spec.eats.includes(other.type) && d < preyDist) {
        nearestPrey = other; preyDist = d;
      }
    }

    if (now >= this.npcAbilityReadyAt) {
      const ab = this.spec.ability;
      const offensive = ab === 'dash' || ab === 'charge' || ab === 'roar';
      const defensive = ab === 'jump' || ab === 'flight' || ab === 'sprint' || ab === 'dig';
      if (offensive && nearestPrey && preyDist < 140) {
        this.scene.triggerNpcAbility(this, now);
      } else if (defensive && nearestThreat && threatDist < 160) {
        this.scene.triggerNpcAbility(this, now);
      }
    }

    if (nearestThreat) {
      if (threatDist < 90 && now >= this.npcHelpReadyAt) {
        this.scene.npcCallHelp(this, now);
      } else if (threatDist < 200 && now >= this.npcAlertReadyAt) {
        this.scene.npcAlertKin(this, now, nearestThreat);
      }
    }
    if (nearestThreat) {
      const odx = nearestThreat.x - this.x;
      const ody = nearestThreat.y - this.y;
      const d = threatDist || 1;
      vx -= (odx / d) * 1.6;
      vy -= (ody / d) * 1.6;
    } else if (nearestPrey) {
      const odx = nearestPrey.x - this.x;
      const ody = nearestPrey.y - this.y;
      const d = preyDist || 1;
      vx += (odx / d) * 1.2;
      vy += (ody / d) * 1.2;
    }

    const len = Math.hypot(vx, vy);
    const speedMult = now < this.speedMultUntil ? this.speedMult : 1;
    const slowMult = now < this.slowedUntil ? 0.45 : 1;
    const waterMult = this.type === 'capybara' && isInWater(this.x, this.y) ? 2.0 : 1;
    const envMult = this.scene.envSpeedMult ? this.scene.envSpeedMult(this) : 1;
    const mult = speedMult * slowMult * waterMult * envMult;
    if (len > 0) {
      vx /= len; vy /= len;
      this.setPosition(
        this.x + vx * this.speed * 0.6 * mult * (delta / 1000),
        this.y + vy * this.speed * 0.6 * mult * (delta / 1000),
      );
      this.facing = vx >= 0 ? 1 : -1;
    }
    this.sync(now);
  }

  updatePlayer(dx, dy, delta, now) {
    if (this.dead) return;
    if (now < this.stunnedUntil) { this.sync(now); return; }
    const len = Math.hypot(dx, dy);
    const speedMult = now < this.speedMultUntil ? this.speedMult : 1;
    const waterMult = this.type === 'capybara' && isInWater(this.x, this.y) ? 2.0 : 1;
    const envMult = this.scene.envSpeedMult ? this.scene.envSpeedMult(this) : 1;
    const sprintMult = this.isPlayer ? (this.scene.sprintMult || 1) : 1;
    const mult = speedMult * waterMult * envMult * sprintMult;
    if (len > 0) {
      dx /= len; dy /= len;
      this.setPosition(
        this.x + dx * this.speed * mult * (delta / 1000),
        this.y + dy * this.speed * mult * (delta / 1000),
      );
      if (dx !== 0) this.facing = dx >= 0 ? 1 : -1;
    }
    this.sync(now);
  }
}

function drawAnimalPreview(scene, x, y, type, scale = 2) {
  const g = scene.add.graphics();
  drawAnimalShape(g, type, x, y, scale);
  return g;
}

function drawAnimalShape(g, type, cx, cy, scale) {
  const spec = ANIMAL_TYPES[type];
  const r = spec.radius * scale;
  g.fillStyle(0x000000, 0.28);
  g.fillEllipse(cx, cy + r * 0.85, r * 2.2, r * 0.55);
  const drawer = ANIMAL_DRAWERS[type] || ANIMAL_DRAWERS.fox;
  drawer(g, cx, cy, r, spec);
}

const ANIMAL_DRAWERS = {
  rabbit(g, cx, cy, r, spec) {
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(cx - r * 0.5, cy + r * 1.0, r * 0.4, r * 0.22);
    g.fillEllipse(cx + r * 0.5, cy + r * 1.0, r * 0.4, r * 0.22);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.3, cy - r * 1.2, r * 0.45, r * 1.4);
    g.fillEllipse(cx + r * 0.3, cy - r * 1.2, r * 0.45, r * 1.4);
    g.fillStyle(0xffb8c0, 0.9);
    g.fillEllipse(cx - r * 0.3, cy - r * 1.15, r * 0.2, r * 0.95);
    g.fillEllipse(cx + r * 0.3, cy - r * 1.15, r * 0.2, r * 0.95);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx, cy, r);
    g.fillStyle(spec.belly, 1);
    g.fillCircle(cx, cy + r * 0.3, r * 0.6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.95, cy + r * 0.2, r * 0.32);
    g.fillCircle(cx + r * 0.95, cy + r * 0.15, r * 0.3);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - r * 0.3, cy - r * 0.05, r * 0.16);
    g.fillCircle(cx + r * 0.3, cy - r * 0.05, r * 0.16);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.26, cy - r * 0.1, r * 0.06);
    g.fillCircle(cx + r * 0.34, cy - r * 0.1, r * 0.06);
    g.fillStyle(0xf48aa0, 1);
    g.fillTriangle(cx - r * 0.1, cy + r * 0.22, cx + r * 0.1, cy + r * 0.22, cx, cy + r * 0.38);
    g.lineStyle(Math.max(1, r * 0.06), 0x7a3848, 1);
    g.beginPath();
    g.moveTo(cx, cy + r * 0.38);
    g.lineTo(cx, cy + r * 0.5);
    g.strokePath();
    g.fillStyle(0xffffff, 1);
    g.fillRect(cx - r * 0.1, cy + r * 0.48, r * 0.07, r * 0.14);
    g.fillRect(cx + r * 0.03, cy + r * 0.48, r * 0.07, r * 0.14);
  },

  owl(g, cx, cy, r, spec) {
    g.fillStyle(0xf4a02c, 1);
    g.fillRect(cx - r * 0.38, cy + r * 1.02, r * 0.18, r * 0.22);
    g.fillRect(cx + r * 0.2, cy + r * 1.02, r * 0.18, r * 0.22);
    g.fillStyle(0x8a4a10, 1);
    g.fillRect(cx - r * 0.4, cy + r * 1.2, r * 0.22, r * 0.06);
    g.fillRect(cx + r * 0.18, cy + r * 1.2, r * 0.22, r * 0.06);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 1.85, r * 2.1);
    g.fillStyle(0x4a3420, 0.75);
    g.fillEllipse(cx - r * 0.72, cy + r * 0.2, r * 0.5, r * 1.35);
    g.fillEllipse(cx + r * 0.72, cy + r * 0.2, r * 0.5, r * 1.35);
    g.lineStyle(Math.max(1, r * 0.06), 0x2a1d10, 0.55);
    for (let i = 0; i < 3; i++) {
      g.lineBetween(cx - r * (0.95 - i * 0.12), cy + r * (0.35 + i * 0.2), cx - r * (0.55 - i * 0.08), cy + r * (0.55 + i * 0.2));
      g.lineBetween(cx + r * (0.55 - i * 0.08), cy + r * (0.55 + i * 0.2), cx + r * (0.95 - i * 0.12), cy + r * (0.35 + i * 0.2));
    }
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.1, r * 1.3);
    for (let i = -2; i <= 2; i++) {
      g.fillStyle(0x4a3420, 0.55);
      g.fillCircle(cx + i * r * 0.22, cy + r * 0.45 + Math.abs(i) * r * 0.08, r * 0.08);
      g.fillCircle(cx + (i + 0.5) * r * 0.22, cy + r * 0.78 + Math.abs(i) * r * 0.05, r * 0.07);
    }
    g.fillStyle(spec.body, 1);
    g.fillTriangle(cx - r * 0.75, cy - r * 0.7, cx - r * 0.45, cy - r * 0.7, cx - r * 0.6, cy - r * 1.3);
    g.fillTriangle(cx + r * 0.45, cy - r * 0.7, cx + r * 0.75, cy - r * 0.7, cx + r * 0.6, cy - r * 1.3);
    g.fillStyle(0x8a6848, 0.4);
    g.fillEllipse(cx, cy - r * 0.15, r * 1.35, r * 1.05);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.4, cy - r * 0.2, r * 0.44);
    g.fillCircle(cx + r * 0.4, cy - r * 0.2, r * 0.44);
    g.lineStyle(Math.max(1, r * 0.09), 0x2a1d10, 0.85);
    g.strokeCircle(cx - r * 0.4, cy - r * 0.2, r * 0.44);
    g.strokeCircle(cx + r * 0.4, cy - r * 0.2, r * 0.44);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - r * 0.35, cy - r * 0.15, r * 0.24);
    g.fillCircle(cx + r * 0.35, cy - r * 0.15, r * 0.24);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.29, cy - r * 0.22, r * 0.08);
    g.fillCircle(cx + r * 0.41, cy - r * 0.22, r * 0.08);
    g.fillStyle(0xf4a02c, 1);
    g.fillTriangle(cx - r * 0.14, cy + r * 0.12, cx + r * 0.14, cy + r * 0.12, cx, cy + r * 0.5);
    g.lineStyle(Math.max(1, r * 0.04), 0x8a4a10, 1);
    g.lineBetween(cx - r * 0.08, cy + r * 0.28, cx + r * 0.08, cy + r * 0.28);
  },

  fox(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 1.15, cy + r * 0.1, r * 1.05, r * 0.7);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 1.6, cy + r * 0.1, r * 0.32);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx, cy, r);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.1, r * 0.9);
    g.fillStyle(spec.body, 1);
    g.fillTriangle(cx + r * 0.35, cy - r * 0.15, cx + r * 0.35, cy + r * 0.5, cx + r * 1.2, cy + r * 0.15);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(cx + r * 0.4, cy + r * 0.15, cx + r * 0.4, cy + r * 0.5, cx + r * 1.1, cy + r * 0.22);
    g.fillStyle(spec.body, 1);
    g.fillTriangle(cx - r * 0.65, cy - r * 0.3, cx - r * 0.15, cy - r * 0.3, cx - r * 0.5, cy - r * 1.2);
    g.fillTriangle(cx + r * 0.15, cy - r * 0.3, cx + r * 0.65, cy - r * 0.3, cx + r * 0.5, cy - r * 1.2);
    g.fillStyle(0x1a1a1a, 1);
    g.fillTriangle(cx - r * 0.55, cy - r * 0.85, cx - r * 0.4, cy - r * 0.85, cx - r * 0.5, cy - r * 1.15);
    g.fillTriangle(cx + r * 0.4, cy - r * 0.85, cx + r * 0.55, cy - r * 0.85, cx + r * 0.5, cy - r * 1.15);
    g.fillStyle(0xffffff, 0.55);
    g.fillCircle(cx - r * 0.75, cy + r * 0.05, r * 0.2);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - r * 0.18, cy - r * 0.15, r * 0.14);
    g.fillCircle(cx + r * 0.28, cy - r * 0.1, r * 0.14);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.14, cy - r * 0.2, r * 0.05);
    g.fillCircle(cx + r * 0.32, cy - r * 0.15, r * 0.05);
    g.fillStyle(0x000000, 1);
    g.fillEllipse(cx + r * 1.18, cy + r * 0.18, r * 0.13, r * 0.1);
    g.lineStyle(Math.max(1, r * 0.04), 0x1a1a1a, 0.5);
    g.lineBetween(cx + r * 0.9, cy + r * 0.3, cx + r * 1.3, cy + r * 0.42);
    g.lineBetween(cx + r * 0.9, cy + r * 0.23, cx + r * 1.3, cy + r * 0.18);
  },

  deer(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillRect(cx - r * 0.72, cy + r * 0.7, r * 0.2, r * 0.7);
    g.fillRect(cx + r * 0.52, cy + r * 0.7, r * 0.2, r * 0.7);
    g.fillStyle(0x2a1608, 1);
    g.fillRect(cx - r * 0.74, cy + r * 1.3, r * 0.24, r * 0.14);
    g.fillRect(cx + r * 0.5, cy + r * 1.3, r * 0.24, r * 0.14);
    g.lineStyle(Math.max(1.8, r * 0.14), 0x6b4a28, 1);
    for (const sx of [-1, 1]) {
      g.beginPath();
      g.moveTo(cx + sx * r * 0.3, cy - r * 0.6);
      g.lineTo(cx + sx * r * 0.55, cy - r * 1.3);
      g.strokePath();
      g.beginPath();
      g.moveTo(cx + sx * r * 0.4, cy - r * 0.95);
      g.lineTo(cx + sx * r * 0.8, cy - r * 1.15);
      g.strokePath();
      g.beginPath();
      g.moveTo(cx + sx * r * 0.48, cy - r * 1.12);
      g.lineTo(cx + sx * r * 0.3, cy - r * 1.55);
      g.strokePath();
      g.beginPath();
      g.moveTo(cx + sx * r * 0.55, cy - r * 1.3);
      g.lineTo(cx + sx * r * 0.75, cy - r * 1.65);
      g.strokePath();
    }
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 2.0, r * 1.85);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.4, r * 1.4, r * 1.05);
    g.fillStyle(0xfff2d0, 0.75);
    g.fillCircle(cx - r * 0.5, cy - r * 0.3, r * 0.13);
    g.fillCircle(cx - r * 0.1, cy - r * 0.45, r * 0.12);
    g.fillCircle(cx + r * 0.3, cy - r * 0.35, r * 0.13);
    g.fillCircle(cx - r * 0.3, cy + r * 0.05, r * 0.1);
    g.fillCircle(cx + r * 0.1, cy - r * 0.1, r * 0.09);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.58, cy - r * 0.6, r * 0.35, r * 0.55);
    g.fillEllipse(cx + r * 0.58, cy - r * 0.6, r * 0.35, r * 0.55);
    g.fillStyle(0xf4c8a0, 0.85);
    g.fillEllipse(cx - r * 0.58, cy - r * 0.58, r * 0.18, r * 0.38);
    g.fillEllipse(cx + r * 0.58, cy - r * 0.58, r * 0.18, r * 0.38);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx + r * 0.95, cy + r * 0.32, r * 0.48, r * 0.35);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx + r * 0.85, cy + r * 0.1, r * 0.5, r * 0.48);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 0.22, cy - r * 0.18, r * 0.13);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 0.26, cy - r * 0.23, r * 0.05);
    g.fillStyle(0x000000, 1);
    g.fillEllipse(cx + r * 1.1, cy + r * 0.22, r * 0.14, r * 0.1);
  },

  boar(g, cx, cy, r, spec) {
    g.fillStyle(0x4a3418, 1);
    g.fillEllipse(cx - r * 0.48, cy + r * 1.3, r * 0.22, r * 0.14);
    g.fillEllipse(cx + r * 0.48, cy + r * 1.3, r * 0.22, r * 0.14);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.95, cy + r * 0.7, r * 0.32, r * 0.6);
    g.fillStyle(0x8a6a3e, 1);
    g.fillCircle(cx - r * 0.95, cy + r * 0.98, r * 0.14);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy + r * 0.3, r * 1.25, r * 1.4);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.7, r * 0.95, r * 0.85);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.55, cy + r * 0.35, r * 0.22, r * 0.5);
    g.fillEllipse(cx + r * 0.55, cy + r * 0.35, r * 0.22, r * 0.5);
    g.fillStyle(0x8a6a3e, 1);
    g.fillCircle(cx - r * 0.55, cy + r * 0.58, r * 0.14);
    g.fillCircle(cx + r * 0.55, cy + r * 0.58, r * 0.14);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx, cy - r * 0.55, r * 0.88);
    g.fillCircle(cx - r * 0.68, cy - r * 0.95, r * 0.2);
    g.fillCircle(cx + r * 0.68, cy - r * 0.95, r * 0.2);
    g.fillStyle(0x5a3e1a, 1);
    g.fillCircle(cx - r * 0.68, cy - r * 0.93, r * 0.11);
    g.fillCircle(cx + r * 0.68, cy - r * 0.93, r * 0.11);
    g.fillStyle(spec.belly, 1);
    g.fillCircle(cx - r * 0.38, cy - r * 0.3, r * 0.28);
    g.fillCircle(cx + r * 0.38, cy - r * 0.3, r * 0.28);
    g.fillEllipse(cx, cy - r * 0.22, r * 0.45, r * 0.3);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - r * 0.28, cy - r * 0.62, r * 0.14);
    g.fillCircle(cx + r * 0.28, cy - r * 0.62, r * 0.14);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.24, cy - r * 0.68, r * 0.05);
    g.fillCircle(cx + r * 0.32, cy - r * 0.68, r * 0.05);
    g.fillStyle(0x2a1608, 1);
    g.fillEllipse(cx, cy - r * 0.3, r * 0.15, r * 0.1);
    g.fillStyle(0xffffff, 1);
    g.fillRect(cx - r * 0.1, cy - r * 0.15, r * 0.08, r * 0.2);
    g.fillRect(cx + r * 0.02, cy - r * 0.15, r * 0.08, r * 0.2);
    g.lineStyle(Math.max(1, r * 0.03), 0x8a6a3e, 0.55);
    g.lineBetween(cx, cy - r * 0.15, cx, cy + r * 0.05);
  },

  capybara(g, cx, cy, r, spec) {
    g.fillStyle(0x4a2e14, 1);
    g.fillRect(cx - r * 0.95, cy + r * 0.55, r * 0.2, r * 0.45);
    g.fillRect(cx - r * 0.25, cy + r * 0.55, r * 0.2, r * 0.45);
    g.fillRect(cx + r * 0.45, cy + r * 0.55, r * 0.2, r * 0.45);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 2.4, r * 1.55);
    g.fillStyle(0x8a5e38, 0.45);
    g.fillEllipse(cx, cy - r * 0.5, r * 1.8, r * 0.35);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.7, r * 0.85);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx + r * 0.95, cy - r * 0.15, r * 0.8);
    g.fillCircle(cx + r * 0.7, cy - r * 0.8, r * 0.22);
    g.fillCircle(cx + r * 1.2, cy - r * 0.8, r * 0.22);
    g.fillStyle(0x3a2614, 1);
    g.fillCircle(cx + r * 0.7, cy - r * 0.78, r * 0.12);
    g.fillCircle(cx + r * 1.2, cy - r * 0.78, r * 0.12);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx + r * 1.55, cy + r * 0.1, r * 0.72, r * 0.52);
    g.fillStyle(spec.belly, 0.6);
    g.fillEllipse(cx + r * 1.55, cy + r * 0.25, r * 0.45, r * 0.3);
    g.fillStyle(0x000000, 1);
    g.fillEllipse(cx + r * 1.75, cy + r * 0.0, r * 0.1, r * 0.08);
    g.fillEllipse(cx + r * 1.9, cy + r * 0.0, r * 0.1, r * 0.08);
    g.lineStyle(Math.max(1, r * 0.05), 0x3a2614, 1);
    g.beginPath();
    g.moveTo(cx + r * 1.7, cy + r * 0.25);
    g.lineTo(cx + r * 1.85, cy + r * 0.28);
    g.lineTo(cx + r * 1.9, cy + r * 0.2);
    g.strokePath();
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 0.92, cy - r * 0.38, r * 0.12);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 0.95, cy - r * 0.42, r * 0.04);
  },

  jaguar(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 1.25, cy + r * 0.1, r * 1.15, r * 0.3);
    g.fillCircle(cx - r * 1.8, cy - r * 0.05, r * 0.22);
    g.fillStyle(0x1a1208, 1);
    g.fillCircle(cx - r * 1.05, cy + r * 0.08, r * 0.1);
    g.fillCircle(cx - r * 1.45, cy + r * 0.08, r * 0.1);
    g.fillCircle(cx - r * 1.7, cy + r * 0.0, r * 0.08);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 2.15, r * 1.5);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.5, r * 0.85);
    const rosettes = [
      [-0.6, -0.3, 0.16], [-0.2, -0.15, 0.13], [0.2, -0.35, 0.15], [0.55, -0.1, 0.12],
      [-0.35, 0.25, 0.12], [0.2, 0.3, 0.13], [-0.9, 0.2, 0.1], [0.45, 0.35, 0.11],
    ];
    for (const [sx, sy, sr] of rosettes) {
      g.fillStyle(0x1a1208, 1);
      g.fillCircle(cx + r * sx, cy + r * sy, r * sr);
      g.fillStyle(spec.body, 1);
      g.fillCircle(cx + r * sx, cy + r * sy, r * sr * 0.55);
      g.fillStyle(0x3a2812, 1);
      g.fillCircle(cx + r * sx, cy + r * sy, r * sr * 0.22);
    }
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx + r * 1.0, cy - r * 0.1, r * 0.72);
    g.fillTriangle(cx + r * 0.62, cy - r * 0.45, cx + r * 0.92, cy - r * 0.45, cx + r * 0.78, cy - r * 1.0);
    g.fillTriangle(cx + r * 1.08, cy - r * 0.45, cx + r * 1.38, cy - r * 0.45, cx + r * 1.22, cy - r * 1.0);
    g.fillStyle(0x2a1608, 1);
    g.fillTriangle(cx + r * 0.72, cy - r * 0.5, cx + r * 0.85, cy - r * 0.5, cx + r * 0.78, cy - r * 0.85);
    g.fillTriangle(cx + r * 1.15, cy - r * 0.5, cx + r * 1.28, cy - r * 0.5, cx + r * 1.22, cy - r * 0.85);
    g.fillStyle(0x1a1208, 1);
    g.fillCircle(cx + r * 0.68, cy - r * 0.22, r * 0.08);
    g.fillCircle(cx + r * 1.35, cy - r * 0.28, r * 0.08);
    g.fillCircle(cx + r * 1.18, cy - r * 0.48, r * 0.07);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx + r * 1.37, cy + r * 0.15, r * 0.45, r * 0.35);
    g.fillStyle(0x000000, 1);
    g.fillTriangle(cx + r * 1.46, cy + r * 0.0, cx + r * 1.6, cy + r * 0.0, cx + r * 1.53, cy + r * 0.17);
    g.lineStyle(Math.max(1, r * 0.05), 0x2a1608, 1);
    g.beginPath();
    g.moveTo(cx + r * 1.53, cy + r * 0.17);
    g.lineTo(cx + r * 1.53, cy + r * 0.3);
    g.strokePath();
    g.fillStyle(0xffee66, 1);
    g.fillCircle(cx + r * 0.82, cy - r * 0.22, r * 0.16);
    g.fillCircle(cx + r * 1.2, cy - r * 0.22, r * 0.16);
    g.fillStyle(0x111111, 1);
    g.fillRect(cx + r * 0.8, cy - r * 0.32, r * 0.04, r * 0.2);
    g.fillRect(cx + r * 1.18, cy - r * 0.32, r * 0.04, r * 0.2);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 0.85, cy - r * 0.28, r * 0.04);
    g.fillCircle(cx + r * 1.23, cy - r * 0.28, r * 0.04);
    g.lineStyle(Math.max(1, r * 0.05), 0x000000, 0.45);
    g.lineBetween(cx + r * 1.4, cy + r * 0.15, cx + r * 1.85, cy + r * 0.05);
    g.lineBetween(cx + r * 1.4, cy + r * 0.2, cx + r * 1.85, cy + r * 0.25);
  },

  bear(g, cx, cy, r, spec) {
    g.fillStyle(0x1a0d06, 1);
    g.fillEllipse(cx - r * 0.5, cy + r * 1.0, r * 0.3, r * 0.18);
    g.fillEllipse(cx + r * 0.5, cy + r * 1.0, r * 0.3, r * 0.18);
    g.fillStyle(0xfff2d0, 0.85);
    for (let i = -1; i <= 1; i++) {
      g.fillCircle(cx - r * 0.5 + i * r * 0.1, cy + r * 1.02, r * 0.04);
      g.fillCircle(cx + r * 0.5 + i * r * 0.1, cy + r * 1.02, r * 0.04);
    }
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx - r * 0.65, cy - r * 0.9, r * 0.35);
    g.fillCircle(cx + r * 0.65, cy - r * 0.9, r * 0.35);
    g.fillStyle(0x2a1a10, 1);
    g.fillCircle(cx - r * 0.65, cy - r * 0.87, r * 0.18);
    g.fillCircle(cx + r * 0.65, cy - r * 0.87, r * 0.18);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx, cy, r * 1.02);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.4, r * 1.15, r * 1.0);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.2, r * 0.65, r * 0.48);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - r * 0.3, cy - r * 0.25, r * 0.14);
    g.fillCircle(cx + r * 0.3, cy - r * 0.25, r * 0.14);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.25, cy - r * 0.31, r * 0.05);
    g.fillCircle(cx + r * 0.35, cy - r * 0.31, r * 0.05);
    g.fillStyle(0x000000, 1);
    g.fillEllipse(cx, cy + r * 0.1, r * 0.18, r * 0.12);
    g.lineStyle(Math.max(1, r * 0.05), 0x1a0d06, 1);
    g.beginPath();
    g.moveTo(cx, cy + r * 0.2);
    g.lineTo(cx, cy + r * 0.32);
    g.strokePath();
    g.lineBetween(cx, cy + r * 0.32, cx - r * 0.12, cy + r * 0.38);
    g.lineBetween(cx, cy + r * 0.32, cx + r * 0.12, cy + r * 0.38);
  },

  tucano(g, cx, cy, r, spec) {
    g.fillStyle(0xf4c07a, 1);
    g.fillRect(cx - r * 0.2, cy + r * 0.95, r * 0.12, r * 0.25);
    g.fillRect(cx + r * 0.08, cy + r * 0.95, r * 0.12, r * 0.25);
    g.fillStyle(0xa66040, 1);
    g.fillRect(cx - r * 0.28, cy + r * 1.18, r * 0.25, r * 0.06);
    g.fillRect(cx + r * 0.03, cy + r * 1.18, r * 0.25, r * 0.06);
    g.fillStyle(spec.body, 1);
    g.fillTriangle(cx - r * 0.9, cy + r * 0.5, cx - r * 1.6, cy - r * 0.1, cx - r * 1.45, cy + r * 0.7);
    g.fillTriangle(cx - r * 0.9, cy + r * 0.3, cx - r * 1.45, cy - r * 0.2, cx - r * 1.4, cy + r * 0.4);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy + r * 0.05, r * 1.75, r * 1.85);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx - r * 0.15, cy + r * 0.25, r * 0.95, r * 1.2);
    g.fillStyle(0xf4a81a, 0.65);
    g.fillEllipse(cx - r * 0.15, cy + r * 0.4, r * 0.55, r * 0.5);
    g.fillStyle(0x181818, 1);
    g.fillEllipse(cx - r * 0.25, cy + r * 0.15, r * 1.05, r * 1.35);
    g.fillStyle(0xffffff, 0.85);
    g.fillEllipse(cx + r * 0.1, cy - r * 0.3, r * 0.7, r * 0.35);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx + r * 0.5, cy - r * 0.55, r * 0.75);
    g.fillStyle(0xf47a1a, 1);
    g.fillTriangle(cx + r * 0.6, cy - r * 0.75, cx + r * 2.05, cy - r * 0.3, cx + r * 0.6, cy - r * 0.12);
    g.fillStyle(0xd44a12, 1);
    g.fillTriangle(cx + r * 0.62, cy - r * 0.52, cx + r * 2.05, cy - r * 0.3, cx + r * 0.62, cy - r * 0.18);
    g.fillStyle(0x6a2808, 1);
    g.fillTriangle(cx + r * 1.6, cy - r * 0.38, cx + r * 2.05, cy - r * 0.3, cx + r * 1.6, cy - r * 0.22);
    g.fillStyle(0xa6350e, 0.85);
    g.fillTriangle(cx + r * 0.62, cy - r * 0.12, cx + r * 1.85, cy - r * 0.3, cx + r * 0.62, cy - r * 0.22);
    g.lineStyle(Math.max(1, r * 0.05), 0x6a2808, 0.8);
    g.lineBetween(cx + r * 0.62, cy - r * 0.45, cx + r * 2.0, cy - r * 0.3);
    g.fillStyle(0xf4a81a, 1);
    g.fillCircle(cx + r * 0.42, cy - r * 0.7, r * 0.28);
    g.fillStyle(0x6bb0e0, 1);
    g.fillCircle(cx + r * 0.42, cy - r * 0.7, r * 0.18);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 0.44, cy - r * 0.7, r * 0.11);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 0.46, cy - r * 0.73, r * 0.04);
  },

  cobra(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx - r * 1.4, cy + r * 0.6, r * 0.55);
    g.fillCircle(cx - r * 0.9, cy + r * 0.28, r * 0.58);
    g.fillCircle(cx - r * 0.35, cy + r * 0.6, r * 0.58);
    g.fillCircle(cx + r * 0.2, cy + r * 0.28, r * 0.58);
    g.fillCircle(cx + r * 0.75, cy + r * 0.55, r * 0.55);
    g.fillStyle(spec.belly, 0.9);
    g.fillCircle(cx - r * 1.4, cy + r * 0.8, r * 0.28);
    g.fillCircle(cx - r * 0.35, cy + r * 0.8, r * 0.28);
    g.fillCircle(cx + r * 0.75, cy + r * 0.78, r * 0.28);
    g.fillStyle(0x5a3e10, 0.7);
    for (const [sx, sy] of [[-1.2, 0.55], [-0.7, 0.3], [-0.15, 0.55], [0.4, 0.3], [0.95, 0.55]]) {
      g.fillTriangle(cx + r * sx, cy + r * (sy - 0.15), cx + r * (sx + 0.18), cy + r * sy, cx + r * sx, cy + r * (sy + 0.15));
      g.fillTriangle(cx + r * sx, cy + r * (sy - 0.15), cx + r * (sx - 0.18), cy + r * sy, cx + r * sx, cy + r * (sy + 0.15));
    }
    g.fillStyle(0x144a18, 0.9);
    g.fillCircle(cx - r * 1.15, cy + r * 0.42, r * 0.08);
    g.fillCircle(cx - r * 0.65, cy + r * 0.45, r * 0.08);
    g.fillCircle(cx - r * 0.1, cy + r * 0.45, r * 0.08);
    g.fillCircle(cx + r * 0.45, cy + r * 0.45, r * 0.08);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx + r * 1.15, cy - r * 0.35, r * 1.15, r * 0.95);
    g.fillStyle(0x144a18, 1);
    g.fillEllipse(cx + r * 1.35, cy - r * 0.5, r * 0.55, r * 0.4);
    g.fillStyle(0xd4b050, 0.65);
    g.fillEllipse(cx + r * 1.35, cy - r * 0.45, r * 0.25, r * 0.2);
    g.fillStyle(0xffee66, 1);
    g.fillCircle(cx + r * 1.3, cy - r * 0.55, r * 0.2);
    g.fillStyle(0x000000, 1);
    g.fillRect(cx + r * 1.27, cy - r * 0.68, r * 0.06, r * 0.24);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 1.35, cy - r * 0.62, r * 0.05);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(cx + r * 1.55, cy - r * 0.18, cx + r * 1.62, cy - r * 0.18, cx + r * 1.58, cy - r * 0.02);
    g.fillTriangle(cx + r * 1.7, cy - r * 0.22, cx + r * 1.77, cy - r * 0.22, cx + r * 1.73, cy - r * 0.05);
    g.fillStyle(0xd43a3a, 1);
    g.fillTriangle(cx + r * 1.6, cy - r * 0.3, cx + r * 2.15, cy - r * 0.45, cx + r * 2.05, cy - r * 0.28);
    g.fillTriangle(cx + r * 1.95, cy - r * 0.4, cx + r * 2.2, cy - r * 0.55, cx + r * 2.1, cy - r * 0.3);
    g.fillTriangle(cx + r * 1.95, cy - r * 0.28, cx + r * 2.2, cy - r * 0.18, cx + r * 2.1, cy - r * 0.1);
  },

  rato(g, cx, cy, r, spec) {
    g.lineStyle(Math.max(1.5, r * 0.22), 0xf4a8b0, 1);
    g.beginPath();
    g.moveTo(cx - r * 0.75, cy + r * 0.3);
    g.lineTo(cx - r * 1.2, cy + r * 0.65);
    g.lineTo(cx - r * 1.7, cy + r * 0.3);
    g.lineTo(cx - r * 1.95, cy - r * 0.15);
    g.strokePath();
    g.fillStyle(0xf4a8b0, 1);
    g.fillEllipse(cx - r * 0.4, cy + r * 0.95, r * 0.22, r * 0.12);
    g.fillEllipse(cx + r * 0.4, cy + r * 0.95, r * 0.22, r * 0.12);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx - r * 0.15, cy - r * 0.95, r * 0.45);
    g.fillCircle(cx + r * 0.55, cy - r * 0.9, r * 0.45);
    g.fillStyle(0xf4a8b0, 1);
    g.fillCircle(cx - r * 0.15, cy - r * 0.9, r * 0.25);
    g.fillCircle(cx + r * 0.55, cy - r * 0.85, r * 0.25);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 1.75, r * 1.5);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.15, r * 0.85);
    g.fillStyle(0x6a635a, 0.45);
    g.fillEllipse(cx, cy - r * 0.4, r * 1.25, r * 0.3);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx + r * 0.95, cy + r * 0.05, r * 0.6, r * 0.45);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx + r * 1.05, cy + r * 0.22, r * 0.38, r * 0.25);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 0.32, cy - r * 0.22, r * 0.17);
    g.fillCircle(cx + r * 0.78, cy - r * 0.15, r * 0.15);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 0.36, cy - r * 0.27, r * 0.06);
    g.fillCircle(cx + r * 0.82, cy - r * 0.2, r * 0.05);
    g.fillStyle(0xf46a80, 1);
    g.fillCircle(cx + r * 1.32, cy + r * 0.18, r * 0.11);
    g.fillStyle(0xffffff, 1);
    g.fillRect(cx + r * 1.2, cy + r * 0.28, r * 0.05, r * 0.13);
    g.fillRect(cx + r * 1.28, cy + r * 0.28, r * 0.05, r * 0.13);
    g.lineStyle(Math.max(1, r * 0.05), 0x000000, 0.5);
    g.lineBetween(cx + r * 1.1, cy + r * 0.3, cx + r * 1.6, cy + r * 0.42);
    g.lineBetween(cx + r * 1.1, cy + r * 0.22, cx + r * 1.6, cy + r * 0.15);
    g.lineBetween(cx + r * 1.1, cy + r * 0.26, cx + r * 1.6, cy + r * 0.28);
  },

  gato(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 1.1, cy + r * 0.0, r * 0.95, r * 0.32);
    g.fillCircle(cx - r * 1.6, cy - r * 0.15, r * 0.22);
    g.lineStyle(Math.max(1, r * 0.09), 0x3a2a12, 0.8);
    g.lineBetween(cx - r * 0.8, cy + r * 0.05, cx - r * 0.8, cy - r * 0.1);
    g.lineBetween(cx - r * 1.1, cy + r * 0.0, cx - r * 1.1, cy - r * 0.15);
    g.lineBetween(cx - r * 1.4, cy - r * 0.08, cx - r * 1.4, cy - r * 0.22);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 1.95, r * 1.35);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.38, r * 1.4, r * 0.8);
    const spots = [
      [-0.55, -0.3, 0.1], [-0.15, -0.15, 0.09], [0.3, -0.35, 0.1], [0.55, 0.0, 0.09],
      [-0.35, 0.2, 0.09], [0.15, 0.25, 0.09], [-0.85, 0.05, 0.08],
    ];
    for (const [sx, sy, sr] of spots) {
      g.fillStyle(0x3a2a12, 1);
      g.fillCircle(cx + r * sx, cy + r * sy, r * sr);
      g.fillStyle(spec.body, 1);
      g.fillCircle(cx + r * sx, cy + r * sy, r * sr * 0.45);
    }
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.6, cy + r * 0.92, r * 0.25, r * 0.14);
    g.fillEllipse(cx + r * 0.15, cy + r * 0.92, r * 0.25, r * 0.14);
    g.fillCircle(cx + r * 0.9, cy - r * 0.08, r * 0.65);
    g.fillTriangle(cx + r * 0.55, cy - r * 0.45, cx + r * 0.82, cy - r * 0.45, cx + r * 0.68, cy - r * 1.0);
    g.fillTriangle(cx + r * 1.0, cy - r * 0.45, cx + r * 1.25, cy - r * 0.45, cx + r * 1.12, cy - r * 1.0);
    g.fillStyle(0xf4b890, 1);
    g.fillTriangle(cx + r * 0.62, cy - r * 0.5, cx + r * 0.76, cy - r * 0.5, cx + r * 0.69, cy - r * 0.88);
    g.fillTriangle(cx + r * 1.06, cy - r * 0.5, cx + r * 1.2, cy - r * 0.5, cx + r * 1.13, cy - r * 0.88);
    g.lineStyle(Math.max(1, r * 0.05), 0x3a2a12, 0.9);
    g.lineBetween(cx + r * 0.82, cy - r * 0.4, cx + r * 0.82, cy - r * 0.55);
    g.lineBetween(cx + r * 0.95, cy - r * 0.4, cx + r * 0.95, cy - r * 0.58);
    g.lineBetween(cx + r * 1.08, cy - r * 0.4, cx + r * 1.08, cy - r * 0.55);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx + r * 1.2, cy + r * 0.2, r * 0.4, r * 0.28);
    g.fillStyle(0x7ab024, 1);
    g.fillCircle(cx + r * 0.73, cy - r * 0.14, r * 0.14);
    g.fillCircle(cx + r * 1.05, cy - r * 0.14, r * 0.14);
    g.fillStyle(0x111111, 1);
    g.fillRect(cx + r * 0.71, cy - r * 0.25, r * 0.04, r * 0.2);
    g.fillRect(cx + r * 1.03, cy - r * 0.25, r * 0.04, r * 0.2);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 0.77, cy - r * 0.2, r * 0.04);
    g.fillCircle(cx + r * 1.09, cy - r * 0.2, r * 0.04);
    g.fillStyle(0xc47050, 1);
    g.fillTriangle(cx + r * 1.3, cy + r * 0.1, cx + r * 1.42, cy + r * 0.1, cx + r * 1.36, cy + r * 0.22);
    g.lineStyle(Math.max(1, r * 0.04), 0x3a2a12, 0.85);
    g.beginPath();
    g.moveTo(cx + r * 1.36, cy + r * 0.22);
    g.lineTo(cx + r * 1.36, cy + r * 0.3);
    g.strokePath();
    g.lineBetween(cx + r * 1.36, cy + r * 0.3, cx + r * 1.28, cy + r * 0.36);
    g.lineBetween(cx + r * 1.36, cy + r * 0.3, cx + r * 1.44, cy + r * 0.36);
    g.lineStyle(Math.max(1, r * 0.05), 0x000000, 0.45);
    g.lineBetween(cx + r * 1.25, cy + r * 0.28, cx + r * 1.7, cy + r * 0.35);
    g.lineBetween(cx + r * 1.25, cy + r * 0.22, cx + r * 1.7, cy + r * 0.15);
  },

  zebra(g, cx, cy, r, spec) {
    g.fillStyle(0x222222, 1);
    g.fillRect(cx - r * 0.7, cy + r * 0.7, r * 0.18, r * 0.7);
    g.fillRect(cx + r * 0.5, cy + r * 0.7, r * 0.18, r * 0.7);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 2.0, r * 1.5);
    g.fillEllipse(cx + r * 0.95, cy - r * 0.35, r * 0.6, r * 0.85);
    g.fillTriangle(cx + r * 0.7, cy - r * 0.9, cx + r * 0.9, cy - r * 0.9, cx + r * 0.75, cy - r * 1.3);
    g.fillTriangle(cx + r * 1.05, cy - r * 0.9, cx + r * 1.25, cy - r * 0.9, cx + r * 1.15, cy - r * 1.3);
    g.fillStyle(0x222222, 1);
    g.fillTriangle(cx + r * 0.5, cy - r * 0.7, cx + r * 0.7, cy - r * 0.5, cx + r * 0.4, cy - r * 0.2);
    for (let i = -2; i <= 2; i++) {
      g.fillRect(cx + i * r * 0.4 - r * 0.05, cy - r * 0.7, r * 0.12, r * 1.4);
    }
    g.fillRect(cx + r * 0.85, cy - r * 0.9, r * 0.08, r * 0.5);
    g.fillStyle(0x444444, 1);
    g.fillEllipse(cx + r * 1.25, cy - r * 0.05, r * 0.3, r * 0.28);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 1.0, cy - r * 0.4, r * 0.1);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 1.02, cy - r * 0.44, r * 0.04);
  },

  macaco(g, cx, cy, r, spec) {
    g.lineStyle(Math.max(2, r * 0.18), spec.body, 1);
    g.beginPath();
    g.moveTo(cx - r * 0.8, cy + r * 0.3);
    g.lineTo(cx - r * 1.4, cy + r * 0.1);
    g.lineTo(cx - r * 1.5, cy - r * 0.5);
    g.strokePath();
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy + r * 0.2, r * 1.3, r * 1.4);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.4, r * 0.8, r * 0.9);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx, cy - r * 0.9, r * 0.85);
    g.fillCircle(cx - r * 0.8, cy - r * 0.9, r * 0.3);
    g.fillCircle(cx + r * 0.8, cy - r * 0.9, r * 0.3);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy - r * 0.8, r * 0.6, r * 0.7);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx - r * 0.25, cy - r * 0.95, r * 0.12);
    g.fillCircle(cx + r * 0.25, cy - r * 0.95, r * 0.12);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - r * 0.22, cy - r * 1.0, r * 0.04);
    g.fillCircle(cx + r * 0.28, cy - r * 1.0, r * 0.04);
    g.fillStyle(0x5a3a1a, 1);
    g.fillEllipse(cx, cy - r * 0.6, r * 0.18, r * 0.12);
  },

  tatu(g, cx, cy, r, spec) {
    g.fillStyle(0x5a4a32, 1);
    g.fillRect(cx - r * 0.6, cy + r * 0.6, r * 0.16, r * 0.4);
    g.fillRect(cx + r * 0.3, cy + r * 0.6, r * 0.16, r * 0.4);
    g.fillStyle(spec.body, 1);
    g.fillTriangle(cx - r * 1.1, cy + r * 0.1, cx - r * 1.9, cy + r * 0.4, cx - r * 1.1, cy + r * 0.5);
    g.fillEllipse(cx, cy - r * 0.1, r * 2.0, r * 1.5);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.5, r * 0.6);
    g.lineStyle(Math.max(1.5, r * 0.1), 0x6a5a3a, 1);
    for (let i = -2; i <= 2; i++) {
      g.beginPath();
      g.moveTo(cx + i * r * 0.35, cy - r * 0.8);
      g.lineTo(cx + i * r * 0.35, cy + r * 0.3);
      g.strokePath();
    }
    g.fillStyle(0x6a5a3a, 0.4);
    g.fillEllipse(cx, cy - r * 0.5, r * 1.6, r * 0.4);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx + r * 1.1, cy + r * 0.05, r * 0.55, r * 0.45);
    g.fillTriangle(cx + r * 1.4, cy - r * 0.1, cx + r * 1.8, cy + r * 0.1, cx + r * 1.4, cy + r * 0.25);
    g.fillTriangle(cx + r * 0.95, cy - r * 0.3, cx + r * 1.1, cy - r * 0.3, cx + r * 1.0, cy - r * 0.6);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 1.15, cy - r * 0.05, r * 0.09);
  },

  leao(g, cx, cy, r, spec) {
    g.lineStyle(Math.max(2, r * 0.12), spec.body, 1);
    g.beginPath(); g.moveTo(cx - r * 1.1, cy + r * 0.1); g.lineTo(cx - r * 1.7, cy + r * 0.3); g.strokePath();
    g.fillStyle(0x6a4a20, 1); g.fillCircle(cx - r * 1.75, cy + r * 0.32, r * 0.18);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 2.0, r * 1.4);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.4, r * 1.4, r * 0.8);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.6, cy + r * 0.95, r * 0.28, r * 0.2);
    g.fillEllipse(cx + r * 0.3, cy + r * 0.95, r * 0.28, r * 0.2);
    g.fillStyle(0x9a6a28, 1);
    g.fillCircle(cx + r * 0.95, cy - r * 0.15, r * 0.95);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      g.fillTriangle(
        cx + r * 0.95 + Math.cos(a) * r * 0.7, cy - r * 0.15 + Math.sin(a) * r * 0.7,
        cx + r * 0.95 + Math.cos(a + 0.3) * r * 0.7, cy - r * 0.15 + Math.sin(a + 0.3) * r * 0.7,
        cx + r * 0.95 + Math.cos(a + 0.15) * r * 1.15, cy - r * 0.15 + Math.sin(a + 0.15) * r * 1.15,
      );
    }
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx + r * 0.95, cy - r * 0.1, r * 0.62);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx + r * 0.95, cy + r * 0.1, r * 0.5, r * 0.4);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 0.75, cy - r * 0.2, r * 0.1);
    g.fillCircle(cx + r * 1.15, cy - r * 0.2, r * 0.1);
    g.fillStyle(0x3a2412, 1);
    g.fillTriangle(cx + r * 0.85, cy, cx + r * 1.05, cy, cx + r * 0.95, cy + r * 0.12);
  },

  tigre(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 2.1, r * 1.45);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.4, r * 1.5, r * 0.8);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 1.2, cy + r * 0.05, r * 1.0, r * 0.3);
    g.fillStyle(0x1a1a1a, 1);
    for (let i = -2; i <= 2; i++) {
      g.fillRect(cx + i * r * 0.45 - r * 0.04, cy - r * 0.6, r * 0.1, r * 1.0);
    }
    g.fillRect(cx - r * 1.5, cy - r * 0.05, r * 0.08, r * 0.25);
    g.fillRect(cx - r * 1.1, cy - r * 0.05, r * 0.08, r * 0.25);
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.6, cy + r * 0.95, r * 0.26, r * 0.2);
    g.fillEllipse(cx + r * 0.3, cy + r * 0.95, r * 0.26, r * 0.2);
    g.fillCircle(cx + r * 0.95, cy - r * 0.1, r * 0.72);
    g.fillTriangle(cx + r * 0.6, cy - r * 0.5, cx + r * 0.85, cy - r * 0.5, cx + r * 0.72, cy - r * 1.0);
    g.fillTriangle(cx + r * 1.05, cy - r * 0.5, cx + r * 1.3, cy - r * 0.5, cx + r * 1.18, cy - r * 1.0);
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(cx + r * 0.9, cy - r * 0.7, r * 0.06, r * 0.3);
    g.fillRect(cx + r * 1.05, cy - r * 0.65, r * 0.06, r * 0.25);
    g.fillRect(cx + r * 0.78, cy - r * 0.65, r * 0.06, r * 0.25);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx + r * 1.0, cy + r * 0.15, r * 0.45, r * 0.32);
    g.fillStyle(0xffd54a, 1);
    g.fillCircle(cx + r * 0.78, cy - r * 0.18, r * 0.13);
    g.fillCircle(cx + r * 1.12, cy - r * 0.18, r * 0.13);
    g.fillStyle(0x111111, 1);
    g.fillRect(cx + r * 0.76, cy - r * 0.3, r * 0.04, r * 0.24);
    g.fillRect(cx + r * 1.10, cy - r * 0.3, r * 0.04, r * 0.24);
    g.fillStyle(0x2a1608, 1);
    g.fillTriangle(cx + r * 0.92, cy + r * 0.05, cx + r * 1.08, cy + r * 0.05, cx + r * 1.0, cy + r * 0.18);
  },

  hiena(g, cx, cy, r, spec) {
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx, cy, r * 1.9, r * 1.3);
    g.fillCircle(cx + r * 0.6, cy - r * 0.3, r * 0.8);
    g.fillStyle(spec.belly, 1);
    g.fillEllipse(cx, cy + r * 0.35, r * 1.3, r * 0.7);
    g.fillStyle(0x4a3a24, 1);
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      g.fillTriangle(
        cx - r * 0.6 + t * r * 1.4, cy - r * 0.6,
        cx - r * 0.4 + t * r * 1.4, cy - r * 0.6,
        cx - r * 0.5 + t * r * 1.4, cy - r * 1.15,
      );
    }
    for (const [sx, sy] of [[-0.4, -0.1], [0.0, 0.1], [-0.2, 0.3], [0.3, -0.2], [-0.6, 0.2]]) {
      g.fillStyle(0x4a3a24, 0.8);
      g.fillCircle(cx + r * sx, cy + r * sy, r * 0.12);
    }
    g.fillStyle(spec.body, 1);
    g.fillEllipse(cx - r * 0.5, cy + r * 0.9, r * 0.22, r * 0.25);
    g.fillEllipse(cx + r * 0.4, cy + r * 0.9, r * 0.22, r * 0.25);
    g.fillCircle(cx + r * 1.0, cy - r * 0.25, r * 0.55);
    g.fillTriangle(cx + r * 1.3, cy - r * 0.4, cx + r * 1.75, cy - r * 0.1, cx + r * 1.3, cy + r * 0.05);
    g.fillStyle(0x222222, 1);
    g.fillCircle(cx + r * 1.7, cy - r * 0.12, r * 0.1);
    g.fillStyle(spec.body, 1);
    g.fillCircle(cx + r * 0.75, cy - r * 0.85, r * 0.3);
    g.fillCircle(cx + r * 1.2, cy - r * 0.8, r * 0.28);
    g.fillStyle(0x6a5638, 1);
    g.fillCircle(cx + r * 0.75, cy - r * 0.82, r * 0.16);
    g.fillCircle(cx + r * 1.2, cy - r * 0.78, r * 0.15);
    g.fillStyle(0x111111, 1);
    g.fillCircle(cx + r * 1.05, cy - r * 0.3, r * 0.1);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx + r * 1.07, cy - r * 0.34, r * 0.04);
  },
};

const GAME_MODES = {
  normal: {
    label: 'normal',
    desc: 'população equilibrada',
    counts: { rabbit: 12, owl: 5, fox: 4, deer: 6, boar: 3, bear: 3, capybara: 5, jaguar: 3, tucano: 4, cobra: 3, rato: 8, gato: 3, zebra: 6, macaco: 6, tatu: 6, leao: 3, tigre: 3, hiena: 3 },
  },
  alibaba: {
    label: 'ali babá',
    desc: '1 predador contra 40 presas',
    counts: { rabbit: 40, owl: 40, deer: 40, capybara: 40, tucano: 40, rato: 40, fox: 1, boar: 1, bear: 1, jaguar: 1, cobra: 1, gato: 1, zebra: 40, macaco: 40, tatu: 40, leao: 1, tigre: 1, hiena: 1 },
  },
  equal: {
    label: 'igual pra igual',
    desc: 'todos os times com 8 de cada',
    counts: { rabbit: 8, owl: 8, fox: 8, deer: 8, boar: 8, bear: 8, capybara: 8, jaguar: 8, tucano: 8, cobra: 8, rato: 8, gato: 8, zebra: 8, macaco: 8, tatu: 8, leao: 8, tigre: 8, hiena: 8 },
  },
  turbo: {
    label: 'turbo',
    desc: 'todo mundo com velocidade 300',
    counts: { rabbit: 12, owl: 5, fox: 4, deer: 6, boar: 3, bear: 3, capybara: 5, jaguar: 3, tucano: 4, cobra: 3, rato: 8, gato: 3, zebra: 6, macaco: 6, tatu: 6, leao: 3, tigre: 3, hiena: 3 },
    speedOverride: 300,
  },
};

const ANIMAPEDIA = {
  rabbit: 'Pequeno e ágil, o coelho vive em tocas escavadas e está sempre alerta. Seu salto longo é a melhor defesa contra os predadores da floresta.',
  owl: 'Ave de hábitos noturnos, enxerga muito bem no escuro e voa em silêncio absoluto. Quando ameaçada, alça voo e fica invulnerável fora de alcance.',
  fox: 'Esperta e veloz, a raposa usa um dash rápido para surpreender suas presas. Caça coelhos com paciência, faro apurado e muita astúcia.',
  deer: 'Herbívoro de longas pernas e grande resistência, o veado foge em corridas longas. Quando encurralado, seu coice é uma arma e tanto.',
  boar: 'Vive em colônias barulhentas e dá o alarme ao primeiro sinal de perigo. Quando parte para a disparada, é muito difícil de parar.',
  bear: 'O gigante da floresta. Lento, porém com um rugido capaz de atordoar tudo ao redor. Caça veados usando pura força bruta.',
  capybara: 'O maior roedor do mundo é tranquilo e sociável. Nada com rapidez surpreendente e se sente totalmente em casa dentro da água.',
  jaguar: 'Predador de topo da floresta, dono de um bote fatal. Espreita capivaras e ataca com um salto certeiro e implacável.',
  tucano: 'Ave tropical de bico enorme e colorido. Vistosa e leve, voa para bem longe do perigo com a maior facilidade.',
  cobra: 'Rasteira e silenciosa, dá o bote venenoso de surpresa. Fica imóvel à espreita de tucanos distraídos para o ataque certeiro.',
  rato: 'Pequeno, ligeiro e muito curioso. Esgueira-se por qualquer fresta e usa sua corrida ligeira para escapar de quem o caça.',
  gato: 'Felino ágil das matas e caçador de hábitos noturnos. Dá botes precisos e persegue ratos sem dar trégua.',
  zebra: 'Listrada e veloz, a zebra vive em manadas e confia na confusão das listras e na corrida para despistar os caçadores da savana.',
  macaco: 'Travesso e ágil, salta entre as árvores com facilidade e usa as mãos hábeis para escapar e aprontar por onde passa.',
  tatu: 'Protegido por uma carapaça de placas, o tatu se enrola numa bola blindada e dispara para fugir quando o perigo aperta.',
  leao: 'O rei da savana. Forte e imponente, solta um rugido que paralisa as presas antes do bote certeiro sobre as zebras.',
  tigre: 'O maior dos felinos, listrado e furtivo. Espreita em silêncio e dá um bote feroz e fulminante sobre os macacos.',
  hiena: 'Caçadora de bando, de ombros altos e mandíbula potente. Corre em disparada e não larga a presa — nem a carapaça do tatu.',
};

class MenuScene extends Phaser.Scene {
  constructor() { super('menu'); }

  init(data) {
    if (data?.mode) this.mode = data.mode;
  }

  create() {
    this._confirmed = false;
    this.input.keyboard.removeAllListeners();
    this.cameras.main.setBackgroundColor('#12211a');

    const bg = this.add.graphics().setDepth(-100);
    bg.fillGradientStyle(0x183a24, 0x143033, 0x0d1d16, 0x0f2119, 1);
    bg.fillRect(0, 0, VIEW_W, VIEW_H);
    const orbs = [[200, 220, 170, 0x2e7d4f], [1080, 180, 200, 0x2a6e7a], [320, 800, 220, 0x244d2c], [980, 820, 190, 0x3a5a8a]];
    for (const [ox, oy, orad, oc] of orbs) {
      bg.fillStyle(oc, 0.16);
      bg.fillCircle(ox, oy, orad);
      bg.fillStyle(oc, 0.09);
      bg.fillCircle(ox, oy, orad * 1.5);
    }

    this.add.text(VIEW_W / 2, 24, 'Loucura Animal 2', {
      fontFamily: 'system-ui, sans-serif', fontSize: '36px',
      color: '#ffd966', fontStyle: 'bold',
    }).setOrigin(0.5).setStroke('#0a140d', 6).setShadow(0, 4, '#000000', 8, false, true);
    this.add.text(VIEW_W / 2, 52, 'escolha seu bicho  •  cada um tem uma habilidade', {
      fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#c8d6c6',
    }).setOrigin(0.5);
    this.mode = this.mode || 'normal';

    const types = Object.keys(ANIMAL_TYPES);
    this.cards = [];
    const cols = 6;
    const cardW = 100, cardH = 150, gap = 5;
    const gridW = cols * cardW + (cols - 1) * gap;
    const startX = (VIEW_W - gridW) / 2;
    const startY = 78;
    this.gridCols = cols;
    types.forEach((type, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      this.cards.push(this.makeCard(x, y, cardW, cardH, type));
    });
    this.selected = 0;
    this.refreshCards();

    this.modeBg = this.add.graphics();
    this.modeLabel = this.add.text(VIEW_W / 2, VIEW_H - 40, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px',
      color: '#ffffff', align: 'center',
    }).setOrigin(0.5);
    const modeHit = this.add.rectangle(VIEW_W / 2, VIEW_H - 40, 420, 24, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    modeHit.on('pointerup', () => { this.toggleMode(); });
    this.refreshMode();

    const pediaBtn = this.add.text(VIEW_W / 2, VIEW_H - 110, '📖 abrir Animapédia (i)', {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px', color: '#ffffff',
      backgroundColor: '#3a5a8aee', padding: { x: 14, y: 7 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    pediaBtn.on('pointerup', () => this.openPedia());

    this.add.text(VIEW_W / 2, VIEW_H - 16, 'setas/wasd navega  •  enter/espaço confirma  •  m troca modo  •  i = animapédia', {
      fontFamily: 'system-ui, sans-serif', fontSize: '16px', color: '#9ab19a',
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown', (e) => this.handleKey(e));
  }

  toggleMode() {
    const keys = Object.keys(GAME_MODES);
    const idx = keys.indexOf(this.mode);
    this.mode = keys[(idx + 1) % keys.length];
    this.refreshMode();
  }

  refreshMode() {
    const m = GAME_MODES[this.mode];
    this.modeBg.clear();
    this.modeBg.fillStyle(0x2d4d36, 1);
    this.modeBg.fillRoundedRect(VIEW_W / 2 - 210, VIEW_H - 52, 420, 24, 6);
    this.modeBg.lineStyle(2, 0xffd966, 1);
    this.modeBg.strokeRoundedRect(VIEW_W / 2 - 210, VIEW_H - 52, 420, 24, 6);
    this.modeLabel.setText(`modo: ${m.label}  •  ${m.desc}  •  clique ou m pra trocar`);
  }

  makeCard(x, y, w, h, type) {
    const spec = ANIMAL_TYPES[type];
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.33);
    shadow.fillRoundedRect(x + 3, y + 5, w, h, 10);
    const bg = this.add.graphics();
    const draw = (highlighted) => {
      bg.clear();
      bg.fillStyle(highlighted ? 0x2d4d36 : 0x1c2a22, 1);
      bg.fillRoundedRect(x, y, w, h, 10);
      bg.lineStyle(2, highlighted ? 0xffd966 : 0x3a5142, 1);
      bg.strokeRoundedRect(x, y, w, h, 10);
    };
    draw(false);
    drawAnimalPreview(this, x + w / 2, y + 50, type, 2);
    this.add.text(x + w / 2, y + h - 52, spec.label, {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(x + w / 2, y + h - 32, spec.desc, {
      fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#a9bda9',
    }).setOrigin(0.5);
    const preyLabel = spec.eats.length ? `come: ${spec.eats.map((t) => ANIMAL_TYPES[t].label).join(', ')}` : 'não come ninguém';
    this.add.text(x + w / 2, y + h - 14, preyLabel, {
      fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#ffd96690',
    }).setOrigin(0.5);

    const hit = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true, pixelPerfect: false });
    const selectSelf = () => { this.selected = this.cards.findIndex((c) => c.type === type); this.refreshCards(); };
    hit.on('pointerover', selectSelf);
    hit.on('pointerdown', selectSelf);
    hit.on('pointerup', () => { selectSelf(); this.confirm(); });
    return { type, draw };
  }

  refreshCards() { this.cards.forEach((c, i) => c.draw(i === this.selected)); }

  handleKey(e) {
    const cols = this.gridCols || 5;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.selected = (this.selected + this.cards.length - 1) % this.cards.length;
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.selected = (this.selected + 1) % this.cards.length;
    else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.selected = (this.selected + this.cards.length - cols) % this.cards.length;
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.selected = (this.selected + cols) % this.cards.length;
    else if (e.key === 'Enter' || e.key === ' ') { this.confirm(); return; }
    else if (e.key === 'm' || e.key === 'M') { this.toggleMode(); return; }
    else if (e.key === 'i' || e.key === 'I') { this.openPedia(); return; }
    else return;
    this.refreshCards();
  }

  openPedia() {
    this.scene.start('animapedia', { mode: this.mode });
  }

  confirm() {
    if (this._confirmed) return;
    this._confirmed = true;
    const chosen = this.cards[this.selected]?.type || 'fox';
    this.scene.start('forest', { playerType: chosen, mode: this.mode });
  }
}

class AnimapediaScene extends Phaser.Scene {
  constructor() { super('animapedia'); }

  init(data) { this.mode = data?.mode || 'normal'; }

  create() {
    this.input.keyboard.removeAllListeners();
    this.cameras.main.setBackgroundColor('#10201a');

    const bg = this.add.graphics().setDepth(-100);
    bg.fillGradientStyle(0x16321f, 0x143033, 0x0c1c15, 0x0e201a, 1);
    bg.fillRect(0, 0, VIEW_W, VIEW_H);

    this.add.text(VIEW_W / 2, 34, 'Animapédia', {
      fontFamily: 'system-ui, sans-serif', fontSize: '40px',
      color: '#ffd966', fontStyle: 'bold',
    }).setOrigin(0.5).setStroke('#0a140d', 6).setShadow(0, 4, '#000000', 8, false, true);
    this.add.text(VIEW_W / 2, 74, 'a enciclopédia dos bichos de Loucura Animal 2', {
      fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#c8d6c6',
    }).setOrigin(0.5);

    this.types = Object.keys(ANIMAL_TYPES);
    this.listX = 60; this.listY = 124; this.lineH = 32;

    // painel de detalhes (direita)
    this.panelG = this.add.graphics().setDepth(0);
    this.panelG.fillStyle(0x000000, 0.3);
    this.panelG.fillRoundedRect(446, 112, 800, 812, 14);
    this.panelG.fillGradientStyle(0x243729, 0x243729, 0x16241b, 0x16241b, 1);
    this.panelG.fillRoundedRect(440, 104, 800, 812, 14);
    this.panelG.lineStyle(2, 0x4a6a52, 1);
    this.panelG.strokeRoundedRect(440, 104, 800, 812, 14);

    // realce da lista (atrás dos nomes)
    this.listHighlight = this.add.graphics().setDepth(0);

    // lista de bichos (esquerda)
    this.listItems = [];
    this.types.forEach((type, i) => {
      const y = this.listY + i * this.lineH;
      const t = this.add.text(this.listX, y, ANIMAL_TYPES[type].label, {
        fontFamily: 'system-ui, sans-serif', fontSize: '19px', color: '#cfe0cf',
      }).setOrigin(0, 0.5).setDepth(2).setInteractive({ useHandCursor: true });
      const pick = () => { this.selected = i; this.refresh(); };
      t.on('pointerover', pick);
      t.on('pointerdown', pick);
      this.listItems.push(t);
    });

    // textos de detalhe
    this.nameText = this.add.text(840, 472, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '36px',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(2);
    this.typeText = this.add.text(840, 508, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px', color: '#9ad06a',
    }).setOrigin(0.5).setDepth(2);
    this.factsText = this.add.text(480, 548, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px',
      color: '#dfeadf', lineSpacing: 9,
    }).setOrigin(0, 0).setDepth(2);
    this.loreText = this.add.text(480, 728, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '19px',
      color: '#bfd3bf', lineSpacing: 6, wordWrap: { width: 720 },
    }).setOrigin(0, 0).setDepth(2);

    this.add.text(VIEW_W / 2, VIEW_H - 26, 'setas/wasd navega  •  esc/backspace volta ao menu', {
      fontFamily: 'system-ui, sans-serif', fontSize: '16px', color: '#9ab19a',
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown', (e) => this.handleKey(e));

    this.selected = 0;
    this.detailPreview = null;
    this.refresh();
  }

  handleKey(e) {
    const n = this.types.length;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.selected = (this.selected + n - 1) % n;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.selected = (this.selected + 1) % n;
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
      this.scene.start('menu', { mode: this.mode }); return;
    } else { return; }
    this.refresh();
  }

  refresh() {
    const type = this.types[this.selected];
    const spec = ANIMAL_TYPES[type];

    this.listHighlight.clear();
    this.listHighlight.fillStyle(0x2d4d36, 1);
    this.listHighlight.fillRoundedRect(this.listX - 14, this.listY + this.selected * this.lineH - 15, 340, 30, 6);
    this.listItems.forEach((t, i) => t.setColor(i === this.selected ? '#ffd966' : '#cfe0cf'));

    if (this.detailPreview) this.detailPreview.destroy();
    this.detailPreview = drawAnimalPreview(this, 840, 288, type, 6).setDepth(1);

    this.nameText.setText(spec.label);
    const isPred = spec.eats.length > 0;
    this.typeText.setText(isPred ? '🦷 predador' : '🍃 fugitivo (presa)');
    this.typeText.setColor(isPred ? '#ff9a6a' : '#9ad06a');

    const eatsTxt = spec.eats.length ? spec.eats.map((t) => ANIMAL_TYPES[t].label).join(', ') : '— não caça ninguém';
    const preds = PREDATORS_OF[type] || [];
    const predTxt = preds.length ? preds.map((t) => ANIMAL_TYPES[t].label).join(', ') : '— nenhum predador conhecido';
    this.factsText.setText([
      `Habilidade:  ${spec.desc}`,
      `Velocidade:  ${spec.speed}`,
      `Ataque:  ${spec.scare.name}`,
      `Caça:  ${eatsTxt}`,
      `Predadores:  ${predTxt}`,
    ].join('\n'));

    this.loreText.setText(ANIMAPEDIA[type] || '');
  }
}

const NOCTURNAL = new Set(['owl', 'gato', 'cobra', 'rato', 'jaguar', 'leao', 'tigre', 'hiena']);

const POWERUP_KINDS = [
  { kind: 'apple',  name: 'turbo!',    color: 0xff4d4d, glow: 0xff9a9a },
  { kind: 'shield', name: 'escudo!',   color: 0x5aa0ff, glow: 0xaad0ff },
  { kind: 'bolt',   name: 'recarga!',  color: 0xffd54a, glow: 0xfff0a0 },
  { kind: 'gem',    name: '+5 bônus!', color: 0xc05bff, glow: 0xe6b0ff },
];

function drawPowerupIcon(g, kind, x, y, r) {
  if (kind === 'apple') {
    g.fillStyle(0xff4d4d, 1); g.fillCircle(x, y, r);
    g.fillStyle(0xc43030, 1); g.fillCircle(x - r * 0.35, y + r * 0.1, r * 0.5);
    g.fillStyle(0x6a4a2a, 1); g.fillRect(x - r * 0.08, y - r * 1.25, r * 0.16, r * 0.55);
    g.fillStyle(0x3a8a3a, 1); g.fillTriangle(x, y - r * 0.85, x + r * 0.6, y - r * 1.45, x + r * 0.7, y - r * 0.75);
    g.fillStyle(0xffffff, 0.7); g.fillCircle(x + r * 0.3, y - r * 0.35, r * 0.18);
  } else if (kind === 'shield') {
    g.fillStyle(0x5aa0ff, 1);
    g.fillRoundedRect(x - r * 0.85, y - r, r * 1.7, r * 1.35, r * 0.4);
    g.fillTriangle(x - r * 0.85, y + r * 0.3, x + r * 0.85, y + r * 0.3, x, y + r * 1.25);
    g.fillStyle(0xcfe6ff, 1);
    g.fillRoundedRect(x - r * 0.4, y - r * 0.6, r * 0.8, r * 0.7, r * 0.2);
  } else if (kind === 'bolt') {
    g.fillStyle(0xffd54a, 1);
    g.fillTriangle(x + r * 0.35, y - r * 1.1, x - r * 0.55, y + r * 0.15, x + r * 0.1, y + r * 0.15);
    g.fillTriangle(x - r * 0.35, y + r * 1.1, x + r * 0.55, y - r * 0.15, x - r * 0.1, y - r * 0.15);
    g.fillStyle(0xfff3b0, 0.8); g.fillCircle(x, y, r * 0.18);
  } else {
    g.fillStyle(0xc05bff, 1);
    g.fillTriangle(x, y - r, x + r, y - r * 0.1, x, y + r);
    g.fillTriangle(x, y - r, x - r, y - r * 0.1, x, y + r);
    g.fillStyle(0xe6b0ff, 0.85);
    g.fillTriangle(x, y - r, x + r * 0.45, y - r * 0.25, x, y + r * 0.15);
    g.fillStyle(0xffffff, 0.8); g.fillCircle(x - r * 0.2, y - r * 0.35, r * 0.12);
  }
}

class ForestScene extends Phaser.Scene {
  constructor() { super('forest'); }
  init(data) {
    this.playerType = data?.playerType || 'fox';
    this.mode = data?.mode || 'normal';
  }

  create() {
    this.input.keyboard.removeAllListeners();
    this.speedOverride = GAME_MODES[this.mode]?.speedOverride ?? null;
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.drawGround(); this.drawRiver(); this.drawBases(); this.drawPassages(); this.drawDecor(); this.drawTrees();
    this.addVignette();

    const playerBase = baseFor(this.playerType);
    this.player = new Animal(this, this.playerType, playerBase.x, playerBase.y, true);
    this.cameras.main.startFollow(this.player.container, true, 0.1, 0.1);

    this.animals = [this.player];
    const counts = GAME_MODES[this.mode]?.counts || GAME_MODES.normal.counts;
    for (const [type, count] of Object.entries(counts)) {
      const adjusted = type === this.playerType ? count - 1 : count;
      for (let i = 0; i < adjusted; i++) this.spawnNpc(type);
    }

    this.killedByType = {};
    const playerEats = this.player.spec.eats;
    if (playerEats.length > 0) {
      let totalPrey = 0;
      for (const preyType of playerEats) totalPrey += counts[preyType] || 0;
      this.preyTarget = Math.floor(totalPrey / 2) + 1;
      this.preyTotal = totalPrey;
    } else {
      this.preyTarget = null;
      this.preyTotal = 0;
    }
    const myType = this.playerType;
    const iAmPrey = playerEats.length === 0;
    if (iAmPrey) {
      const hasPredator = Object.values(ANIMAL_TYPES).some((s) => s.eats.includes(myType));
      if (hasPredator) {
        this.preyTeamInitial = counts[myType] || 0;
        this.preyWinTarget = Math.floor(this.preyTeamInitial / 2) + 1;
      } else {
        this.preyTeamInitial = 0;
        this.preyWinTarget = null;
      }
    } else {
      this.preyWinTarget = null;
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.passageMenuOpen) { this.closePassageMenu(); return; }
      this.scene.start('menu', { mode: this.mode });
    });
    this.input.keyboard.on('keydown-G', () => this.usePassage());
    this.input.keyboard.on('keydown-P', () => this.scene.start('menu', { mode: this.mode }));
    this.input.keyboard.on('keydown-T', () => window.location.reload());
    this.input.keyboard.on('keydown-E', () => this.triggerAbility());
    this.input.keyboard.on('keydown-SPACE', () => this.triggerAbility());
    this.input.keyboard.on('keydown-H', () => this.teleportHome());
    this.input.keyboard.on('keydown-V', () => this.alertKin());
    this.input.keyboard.on('keydown-B', () => this.lurePredators());
    this.input.keyboard.on('keydown-N', () => this.callHelp());
    this.input.keyboard.on('keydown-F', () => this.placeForceField());

    this.abilityReadyAt = 0;
    this.score = 0;
    this.gameOver = false;
    this.gameStartTime = this.time.now;
    this.gameDuration = 200000;

    this.itemsCollected = 0;
    this.bonus = 0;
    this.itemBuffUntil = 0;
    this.itemBuffName = '';
    this.powerups = [];
    this.powerupG = this.add.graphics().setDepth(-250);
    for (let i = 0; i < 10; i++) this.spawnPowerup();

    // mecânica: rastro de terra ao cavar (tatu)
    this.digMarks = [];
    this.digG = this.add.graphics().setDepth(-260);

    // mecânica: fôlego / corrida (shift)
    this.stamina = 100; this.staminaMax = 100; this.sprintMult = 1;
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.staminaBar = this.add.graphics().setScrollFactor(0).setDepth(100000);
    // mecânica: ciclo dia/noite e clima
    this.isNight = false; this.raining = false;
    this.nightOverlay = this.add.graphics().setScrollFactor(0).setDepth(98000);
    this.rainG = this.add.graphics().setScrollFactor(0).setDepth(98500);
    // mecânica: mato alto (furtividade)
    this.grassG = this.add.graphics().setDepth(50000);
    this.generateGrass();
    this.drawGrassPatches();

    this.hud = this.add.text(10, 10, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px',
      color: '#ffffff', backgroundColor: '#000000aa', padding: { x: 8, y: 6 },
    }).setScrollFactor(0).setDepth(100000);

    this.abilityBar = this.add.graphics().setScrollFactor(0).setDepth(100000);
    this.helpArrowG = this.add.graphics().setScrollFactor(0).setDepth(100004);
    this.helpCalls = [];
    this.fx = this.add.graphics().setDepth(99999);
    this.flashes = [];

    this.forceFields = [];
    this.forceFieldG = this.add.graphics().setDepth(99998);
    this.forceFieldMax = 2;
    this.forceFieldDuration = 8000;
    this.forceFieldRadius = 90;

    this.passageMenuOpen = false;
    this.nearbyPassage = null;
    this.passageMapRect = { x: 40, y: 38, w: 560, h: 420 };
    this.passageCursor = { x: -1, y: -1 };
    this.passageMapLabels = [];
    this.passageHint = this.add.text(VIEW_W / 2, VIEW_H - 74, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#6a3aa0cc', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100005).setVisible(false);
    this.passageMenuG = this.add.graphics().setScrollFactor(0).setDepth(100010).setVisible(false);
    this.passageMenuText = this.add.text(VIEW_W / 2, 10, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#ffffff',
      backgroundColor: '#00000099', padding: { x: 6, y: 3 }, align: 'center',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100011).setVisible(false);
    const mr = this.passageMapRect;
    this.passageMapHit = this.add.rectangle(
      mr.x + mr.w / 2, mr.y + mr.h / 2, mr.w, mr.h, 0xffffff, 0.001,
    ).setScrollFactor(0).setDepth(100012)
      .setInteractive({ useHandCursor: true }).setVisible(false);
    this.passageMapHit.on('pointerdown', (p) => this.handleMapClick(p));
    this.passageMapHit.on('pointermove', (p) => { this.passageCursor.x = p.x; this.passageCursor.y = p.y; });
    this.passageMapHit.on('pointerout', () => { this.passageCursor.x = -1; this.passageCursor.y = -1; });

    this.updateHud(0);
  }

  spawnNpc(type) {
    const base = baseFor(type);
    let x, y;
    if (base && Math.random() < 0.75) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * (base.radius - 30);
      x = base.x + Math.cos(a) * r;
      y = base.y + Math.sin(a) * r;
    } else {
      let tries = 0;
      do {
        x = 100 + Math.random() * (WORLD_W - 200);
        y = 100 + Math.random() * (WORLD_H - 200);
        tries++;
      } while (this.player && Math.hypot(x - this.player.x, y - this.player.y) < 250 && tries < 8);
    }
    this.animals.push(new Animal(this, type, x, y));
  }

  drawBases() {
    const g = this.add.graphics().setDepth(-400);
    const iconG = this.add.graphics().setDepth(-395);
    for (const base of BASES) {
      const spec = ANIMAL_TYPES[base.type];
      g.fillStyle(spec.body, 0.18);
      g.fillCircle(base.x, base.y, base.radius);
      g.fillStyle(0xf4e4b0, 0.22);
      g.fillCircle(base.x, base.y, base.radius - 14);
      g.lineStyle(2, spec.body, 0.8);
      g.strokeCircle(base.x, base.y, base.radius);
      const dashes = 28;
      g.lineStyle(2, 0xf4e4b0, 0.6);
      for (let i = 0; i < dashes; i += 2) {
        const a1 = (i / dashes) * Math.PI * 2;
        const a2 = ((i + 1) / dashes) * Math.PI * 2;
        g.beginPath();
        g.arc(base.x, base.y, base.radius - 4, a1, a2);
        g.strokePath();
      }
      iconG.fillStyle(spec.body, 1);
      iconG.fillCircle(base.x, base.y, 14);
      iconG.fillStyle(spec.belly, 1);
      iconG.fillCircle(base.x, base.y + 3, 8);
      const label = this.add.text(base.x, base.y - base.radius - 8, `base: ${spec.label}`, {
        fontFamily: 'system-ui, sans-serif', fontSize: '18px',
        color: '#ffffff', backgroundColor: '#00000066', padding: { x: 6, y: 2 },
      }).setOrigin(0.5).setDepth(-390);
    }
  }

  triggerAbility() {
    if (this.gameOver || this.player.dead) return;
    const now = this.time.now;
    if (now < this.abilityReadyAt) return;
    const spec = this.player.spec;
    this.abilityReadyAt = now + spec.cooldown;

    if (spec.ability === 'dash') {
      this.player.speedMult = 2.6; this.player.speedMultUntil = now + 500;
      this.flashRing(this.player.x, this.player.y, 40, 0xffd966);
    } else if (spec.ability === 'jump') {
      const dx = this.player.facing, dy = 0;
      this.player.setPosition(this.player.x + dx * 180, this.player.y + dy);
      this.player.invulnerableUntil = now + 200;
      this.flashRing(this.player.x, this.player.y, 50, 0xb3e5ff);
    } else if (spec.ability === 'sprint') {
      this.player.speedMult = 1.9; this.player.speedMultUntil = now + 2500;
    } else if (spec.ability === 'charge') {
      this.player.speedMult = 2.4; this.player.speedMultUntil = now + 900;
      this.player.contactEats = true; this.player.contactEatsUntil = now + 900;
      this.flashRing(this.player.x, this.player.y, 44, 0xff8866);
    } else if (spec.ability === 'flight') {
      this.player.speedMult = 1.6; this.player.speedMultUntil = now + 3000;
      this.player.invulnerableUntil = now + 3000;
    } else if (spec.ability === 'roar') {
      this.flashRing(this.player.x, this.player.y, 230, 0xffe0a0);
      for (const a of this.animals) {
        if (a === this.player || a.dead) continue;
        const d = Math.hypot(a.x - this.player.x, a.y - this.player.y);
        if (d < 230) a.stunnedUntil = now + 2000;
      }
    } else if (spec.ability === 'dig') {
      this.player.invulnerableUntil = now + 2000;
      this.player.invisibleUntil = now + 2000;
      this.player.digUntil = now + 2000;
      this.player.lastDigMark = 0;
      this.flashRing(this.player.x, this.player.y, 50, 0x8a6a3a);
    }
  }

  lurePredators() {
    if (this.gameOver || this.player.dead) return;
    const now = this.time.now;
    const playerType = this.player.type;
    const playerEats = this.player.spec.eats;
    let predators = 0, prey = 0;
    for (const a of this.animals) {
      if (a === this.player || a.dead) continue;
      const isPredator = a.spec.eats.includes(playerType);
      const isPrey = playerEats.includes(a.type);
      if (isPredator) {
        a.luredUntil = now + 8000;
        predators++;
      } else if (isPrey) {
        a.slowedUntil = now + 8000;
        prey++;
      }
    }
    this.flashRing(this.player.x, this.player.y, 180, 0xff66aa);
    if (!this.lureToast) {
      this.lureToast = this.add.text(VIEW_W / 2, 108, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '20px',
        color: '#ffffff', backgroundColor: '#9a2a66ee', padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100002);
    }
    let msg;
    if (predators > 0) msg = `virou isca  •  ${predators} predador(es) vindo em você`;
    else if (prey > 0) msg = `${prey} fugitivo(s) ficaram lentos`;
    else msg = `ninguém por aqui pra afetar`;
    this.lureToast.setText(msg);
    this.lureToast.setAlpha(1);
    this.tweens.add({ targets: this.lureToast, alpha: 0, delay: 2400, duration: 600 });
  }

  callHelp() {
    if (this.gameOver || this.player.dead) return;
    const now = this.time.now;
    this.performScare(this.player, now);
    let count = 0;
    for (const a of this.animals) {
      if (a === this.player || a.dead) continue;
      if (a.type !== this.player.type) continue;
      a.helpingUntil = now + 6000;
      a.attackReadyAt = now + 500;
      a.alertedUntil = 0;
      a.helpTargetAnimal = this.player;
      a.helpTargetType = this.player.type;
      count++;
    }
    this.flashRing(this.player.x, this.player.y, 140, 0x66ff99);
    if (!this.helpToast) {
      this.helpToast = this.add.text(VIEW_W / 2, 86, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '20px',
        color: '#ffffff', backgroundColor: '#2d7a4aee', padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100002);
    }
    const scareName = this.player.spec.scare.name;
    this.helpToast.setText(`${count} ${this.player.spec.label}(s) vindo ajudar  •  ataque: ${scareName}`);
    this.helpToast.setAlpha(1);
    this.tweens.add({ targets: this.helpToast, alpha: 0, delay: 2400, duration: 600 });
  }

  drawPassages() {
    const g = this.add.graphics().setDepth(-385);
    for (const base of BASES) {
      const { x: px, y: py } = passagePos(base);
      g.fillStyle(0x6a3aa0, 0.25);
      g.fillCircle(px, py, PASSAGE_RADIUS + 6);
      g.fillStyle(0x000000, 0.9);
      g.fillCircle(px, py, PASSAGE_RADIUS - 6);
      g.lineStyle(2, 0xc9a0ff, 1);
      g.strokeCircle(px, py, PASSAGE_RADIUS - 4);
      g.lineStyle(1, 0xffffff, 0.35);
      g.strokeCircle(px, py, PASSAGE_RADIUS - 12);
      this.add.text(px, py + PASSAGE_RADIUS + 4, 'passagem', {
        fontFamily: 'system-ui, sans-serif', fontSize: '15px',
        color: '#c9a0ff', backgroundColor: '#00000099', padding: { x: 4, y: 1 },
      }).setOrigin(0.5, 0).setDepth(-380);
    }
  }

  nearbyPassageFor(x, y) {
    for (const base of BASES) {
      const p = passagePos(base);
      if (Math.hypot(x - p.x, y - p.y) < PASSAGE_RADIUS) return base;
    }
    return null;
  }

  usePassage() {
    if (this.gameOver || this.player.dead) return;
    if (this.passageMenuOpen) { this.confirmPassage(); return; }
    if (!this.nearbyPassage) return;
    this.openPassageMenu();
  }

  ensureMapLabels() {
    if (this.passageMapLabels.length > 0) return;
    const m = this.passageMapRect;
    const sx = m.w / WORLD_W, sy = m.h / WORLD_H;
    for (const base of BASES) {
      const spec = ANIMAL_TYPES[base.type];
      const t = this.add.text(
        m.x + base.x * sx,
        m.y + base.y * sy - base.radius * sx - 6,
        spec.label,
        {
          fontFamily: 'system-ui, sans-serif', fontSize: '14px',
          color: '#ffffff', backgroundColor: '#00000099', padding: { x: 3, y: 1 },
        },
      ).setOrigin(0.5).setScrollFactor(0).setDepth(100013).setVisible(false);
      this.passageMapLabels.push(t);
    }
  }

  openPassageMenu() {
    this.passageMenuOpen = true;
    this.ensureMapLabels();
    this.passageMenuG.setVisible(true);
    this.passageMenuText.setVisible(true);
    this.passageMapHit.setVisible(true);
    this.passageHint.setVisible(false);
    for (const t of this.passageMapLabels) t.setVisible(true);
    this.renderPassageMenu();
  }

  closePassageMenu() {
    this.passageMenuOpen = false;
    this.passageMenuG.setVisible(false);
    this.passageMenuText.setVisible(false);
    this.passageMapHit.setVisible(false);
    for (const t of this.passageMapLabels) t.setVisible(false);
    this.passageCursor.x = -1;
    this.passageCursor.y = -1;
  }

  renderPassageMenu() {
    const g = this.passageMenuG;
    g.clear();
    g.fillStyle(0x000000, 0.72);
    g.fillRect(0, 0, VIEW_W, VIEW_H);
    const m = this.passageMapRect;
    const sx = m.w / WORLD_W, sy = m.h / WORLD_H;

    g.fillStyle(COLORS.grass, 1);
    g.fillRoundedRect(m.x, m.y, m.w, m.h, 8);
    g.fillStyle(COLORS.clearing, 0.35);
    for (const base of BASES) {
      g.fillCircle(m.x + base.x * sx, m.y + base.y * sy, base.radius * sx * 1.2);
    }

    const segs = 48;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const wx = t * WORLD_W;
      const wy = WORLD_H * 0.55 + Math.sin(t * 6) * 160 + Math.cos(t * 3) * 60;
      pts.push({ x: m.x + wx * sx, y: m.y + wy * sy });
    }
    const rw = 70 * sy;
    g.fillStyle(COLORS.riverDeep, 1);
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y - rw);
    for (const p of pts) g.lineTo(p.x, p.y - rw);
    for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i].x, pts[i].y + rw);
    g.closePath(); g.fillPath();
    g.fillStyle(COLORS.river, 1);
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y - rw + 2);
    for (const p of pts) g.lineTo(p.x, p.y - rw + 2);
    for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i].x, pts[i].y + rw - 2);
    g.closePath(); g.fillPath();

    for (const base of BASES) {
      const bx = m.x + base.x * sx, by = m.y + base.y * sy;
      const r = base.radius * sx;
      const spec = ANIMAL_TYPES[base.type];
      g.fillStyle(spec.body, 0.35);
      g.fillCircle(bx, by, r);
      g.lineStyle(1.5, spec.body, 1);
      g.strokeCircle(bx, by, r);
      g.fillStyle(spec.body, 1);
      g.fillCircle(bx, by, 3);
      const pp = passagePos(base);
      const ppx = m.x + pp.x * sx, ppy = m.y + pp.y * sy;
      g.fillStyle(0x000000, 0.9);
      g.fillCircle(ppx, ppy, 4);
      g.lineStyle(1.5, 0xc9a0ff, 1);
      g.strokeCircle(ppx, ppy, 4);
    }

    for (const a of this.animals) {
      if (a.isPlayer || a.dead) continue;
      const ax = m.x + a.x * sx, ay = m.y + a.y * sy;
      g.fillStyle(a.spec.body, 0.9);
      g.fillCircle(ax, ay, 2);
    }

    const ppx = m.x + this.player.x * sx;
    const ppy = m.y + this.player.y * sy;
    const pulse = 1 + 0.25 * Math.sin(this.time.now / 180);
    g.lineStyle(2, 0xffd966, 0.6);
    g.strokeCircle(ppx, ppy, 8 * pulse);
    g.fillStyle(0xffd966, 1);
    g.fillCircle(ppx, ppy, 4);
    g.lineStyle(1.5, 0x000000, 1);
    g.strokeCircle(ppx, ppy, 4);

    g.lineStyle(3, 0xc9a0ff, 1);
    g.strokeRoundedRect(m.x, m.y, m.w, m.h, 8);

    const cx = this.passageCursor.x, cy = this.passageCursor.y;
    if (cx >= m.x && cx <= m.x + m.w && cy >= m.y && cy <= m.y + m.h) {
      g.lineStyle(1, 0xffffff, 0.5);
      g.beginPath();
      g.moveTo(m.x, cy); g.lineTo(m.x + m.w, cy);
      g.moveTo(cx, m.y); g.lineTo(cx, m.y + m.h);
      g.strokePath();
      g.lineStyle(2, 0xc9a0ff, 1);
      g.strokeCircle(cx, cy, 6);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(cx, cy, 2);
    }

    this.passageMenuText.setText('PASSAGEM SECRETA  —  clique no mapa pra teleportar   •   esc cancela');
  }

  handleMapClick(pointer) {
    if (!this.passageMenuOpen) return;
    const m = this.passageMapRect;
    const relX = pointer.x - m.x;
    const relY = pointer.y - m.y;
    if (relX < 0 || relX > m.w || relY < 0 || relY > m.h) return;
    const worldX = Phaser.Math.Clamp(relX / m.w * WORLD_W, 30, WORLD_W - 30);
    const worldY = Phaser.Math.Clamp(relY / m.h * WORLD_H, 30, WORLD_H - 30);
    this.flashRing(this.player.x, this.player.y, 60, 0xc9a0ff);
    this.player.setPosition(worldX, worldY);
    this.player.invulnerableUntil = this.time.now + 1500;
    this.flashRing(this.player.x, this.player.y, 80, 0xc9a0ff);
    this.closePassageMenu();
  }

  triggerNpcAbility(npc, now) {
    if (npc.dead || now < npc.stunnedUntil) return;
    npc.npcAbilityReadyAt = now + npc.spec.cooldown * 1.2;
    const ab = npc.spec.ability;
    if (ab === 'dash') {
      npc.speedMult = 2.6; npc.speedMultUntil = now + 500;
      this.flashRing(npc.x, npc.y, 40, 0xffd966);
    } else if (ab === 'jump') {
      npc.setPosition(npc.x + (npc.facing || 1) * 180, npc.y);
      npc.invulnerableUntil = now + 200;
      this.flashRing(npc.x, npc.y, 50, 0xb3e5ff);
    } else if (ab === 'sprint') {
      npc.speedMult = 1.9; npc.speedMultUntil = now + 2500;
    } else if (ab === 'charge') {
      npc.speedMult = 2.4; npc.speedMultUntil = now + 900;
      npc.contactEats = true; npc.contactEatsUntil = now + 900;
      this.flashRing(npc.x, npc.y, 44, 0xff8866);
    } else if (ab === 'flight') {
      npc.speedMult = 1.6; npc.speedMultUntil = now + 3000;
      npc.invulnerableUntil = now + 3000;
    } else if (ab === 'roar') {
      this.flashRing(npc.x, npc.y, 230, 0xffe0a0);
      for (const a of this.animals) {
        if (a === npc || a.dead) continue;
        const d = Math.hypot(a.x - npc.x, a.y - npc.y);
        if (d < 230) a.stunnedUntil = Math.max(a.stunnedUntil, now + 2000);
      }
    } else if (ab === 'dig') {
      npc.invulnerableUntil = now + 2000;
      npc.invisibleUntil = now + 2000;
      npc.digUntil = now + 2000;
      npc.lastDigMark = 0;
      this.flashRing(npc.x, npc.y, 40, 0x8a6a3a);
    }
  }

  npcCallHelp(npc, now) {
    if (npc.dead) return;
    npc.npcHelpReadyAt = now + 10000;
    this.performScare(npc, now, npc.type);
    for (const a of this.animals) {
      if (a === npc || a.dead || a.isPlayer) continue;
      if (a.type !== npc.type) continue;
      a.helpingUntil = now + 6000;
      a.attackReadyAt = now + 500;
      a.alertedUntil = 0;
      a.helpTargetAnimal = npc;
      a.helpTargetType = npc.type;
    }
    this.flashRing(npc.x, npc.y, 140, 0x66ff99);
    this.showNpcShout(`${npc.spec.label}: ajudaaaa!`, '#2d7a4aee');
    this.helpCalls.push({ animal: npc, until: now + 5000, duration: 5000 });
  }

  npcAlertKin(npc, now, threat) {
    if (npc.dead) return;
    npc.npcAlertReadyAt = now + 6000;
    for (const a of this.animals) {
      if (a === npc || a.dead || a.isPlayer) continue;
      if (a.type !== npc.type) continue;
      a.alertedUntil = now + 4000;
      a.alertSourceX = threat.x;
      a.alertSourceY = threat.y;
    }
    this.flashRing(npc.x, npc.y, 180, 0xffffff);
    this.showNpcShout(`${npc.spec.label}: fujaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam!`, '#b33a3aee');
  }

  showNpcShout(text, bg) {
    if (!this.npcShout) {
      this.npcShout = this.add.text(VIEW_W / 2, 140, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '21px',
        color: '#ffffff', padding: { x: 10, y: 5 }, fontStyle: 'bold',
        align: 'center', wordWrap: { width: VIEW_W - 40 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100003);
    }
    this.npcShout.setStyle({ backgroundColor: bg });
    this.npcShout.setText(text);
    this.npcShout.setAlpha(1);
    if (this.npcShoutTween) this.npcShoutTween.stop();
    this.npcShoutTween = this.tweens.add({ targets: this.npcShout, alpha: 0, delay: 1400, duration: 500 });
  }

  performScare(attacker, now, targetType) {
    const tType = targetType ?? this.player.type;
    const { range, push, stun } = attacker.spec.scare;
    let hit = false;
    for (const pred of this.animals) {
      if (pred === attacker || pred.dead) continue;
      if (!pred.spec.eats.includes(tType)) continue;
      const dx = pred.x - attacker.x;
      const dy = pred.y - attacker.y;
      const d = Math.hypot(dx, dy);
      if (d < range) {
        const nx = dx / (d || 1), ny = dy / (d || 1);
        pred.setPosition(pred.x + nx * push, pred.y + ny * push);
        pred.stunnedUntil = Math.max(pred.stunnedUntil, now + stun);
        hit = true;
      }
    }
    if (hit) this.flashRing(attacker.x, attacker.y, range, 0xffc266);
  }

  alertKin() {
    if (this.gameOver || this.player.dead) return;
    const now = this.time.now;
    let count = 0;
    for (const a of this.animals) {
      if (a === this.player || a.dead) continue;
      if (a.type !== this.player.type) continue;
      a.alertedUntil = now + 5000;
      a.alertSourceX = this.player.x;
      a.alertSourceY = this.player.y;
      count++;
    }
    this.flashRing(this.player.x, this.player.y, 260, 0xffffff);
    if (!this.alertToast) {
      this.alertToast = this.add.text(VIEW_W / 2, 64, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '20px',
        color: '#ffffff', backgroundColor: '#b33a3aee', padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100002);
    }
    this.alertToast.setText(`ameaça comunicada  •  ${count} ${this.player.spec.label}(s) fugindo de você`);
    this.alertToast.setAlpha(1);
    this.tweens.add({ targets: this.alertToast, alpha: 0, delay: 1600, duration: 600 });
  }

  teleportHome() {
    if (this.gameOver || this.player.dead) return;
    const base = baseFor(this.player.type);
    if (!base) return;
    this.player.setPosition(base.x, base.y);
    this.player.invulnerableUntil = this.time.now + 400;
    this.flashRing(base.x, base.y, 80, 0x8ed1ff);
  }

  flashRing(x, y, maxR, color) {
    this.flashes.push({ x, y, r: 10, maxR, color, alpha: 1 });
  }

  placeForceField() {
    if (this.gameOver || this.player.dead || this.passageMenuOpen) return;
    const now = this.time.now;
    if (this.player.spec.eats.length > 0) {
      this.goGiant(now);
      return;
    }
    const kept = [];
    for (const f of this.forceFields) {
      if (!f.activated || now < f.until) kept.push(f);
      else if (f._label) f._label.destroy();
    }
    this.forceFields = kept;
    if (this.forceFields.length >= this.forceFieldMax) {
      const removed = this.forceFields.shift();
      if (removed._label) removed._label.destroy();
    }
    this.forceFields.push({
      x: this.player.x,
      y: this.player.y,
      radius: this.forceFieldRadius,
      bornAt: now,
      armed: true,
      activated: false,
      activatedAt: 0,
      until: Infinity,
      trapped: new Set(),
    });
    this.flashRing(this.player.x, this.player.y, this.forceFieldRadius, 0xffd966);
  }

  goGiant(now) {
    const cooldown = 15000;
    const duration = 6000;
    if (now < (this.giantReadyAt || 0)) return;
    this.player.giantUntil = now + duration;
    this.giantReadyAt = now + cooldown;
    this.flashRing(this.player.x, this.player.y, 140, 0xffdd66);
    const preyList = this.animals.filter((a) =>
      !a.isPlayer && !a.dead && this.player.spec.eats.includes(a.type),
    );
    let teleportedLabel = '';
    if (preyList.length > 0) {
      const chosen = preyList[Math.floor(Math.random() * preyList.length)];
      const ang = Math.random() * Math.PI * 2;
      const rad = this.player.spec.radius * 2.5 + chosen.spec.radius + 6;
      chosen.setPosition(this.player.x + Math.cos(ang) * rad, this.player.y + Math.sin(ang) * rad);
      chosen.stunnedUntil = Math.max(chosen.stunnedUntil || 0, now + 500);
      this.flashRing(chosen.x, chosen.y, 45, 0xff66aa);
      teleportedLabel = `  •  um ${chosen.spec.label} caiu do céu`;
    }
    if (!this.giantToast) {
      this.giantToast = this.add.text(VIEW_W / 2, 132, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '20px',
        color: '#ffffff', backgroundColor: '#aa7700ee', padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100002);
    }
    this.giantToast.setText(`você virou gigante por ${duration / 1000}s${teleportedLabel}`);
    this.giantToast.setAlpha(1);
    this.tweens.add({ targets: this.giantToast, alpha: 0, delay: 2600, duration: 600 });
  }

  activateTrap(trap, triggerer, now) {
    trap.armed = false;
    trap.activated = true;
    trap.activatedAt = now;
    trap.until = now + 30000;
    trap.trapped.add(triggerer);
    triggerer.stunnedUntil = Math.max(triggerer.stunnedUntil || 0, trap.until);
    const candidates = this.animals.filter((a) =>
      !a.isPlayer && !a.dead && a !== triggerer && a.spec.eats.includes(this.player.type),
    );
    if (candidates.length > 0) {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.random() * Math.max(5, trap.radius - chosen.spec.radius - 8);
      chosen.setPosition(trap.x + Math.cos(ang) * rad, trap.y + Math.sin(ang) * rad);
      chosen.stunnedUntil = Math.max(chosen.stunnedUntil || 0, trap.until);
      trap.trapped.add(chosen);
      this.flashRing(chosen.x, chosen.y, 50, 0xff66aa);
    }
    this.flashRing(trap.x, trap.y, trap.radius, 0xff5533);
    if (!this.trapToast) {
      this.trapToast = this.add.text(VIEW_W / 2, 132, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '20px',
        color: '#ffffff', backgroundColor: '#9a3322ee', padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100002);
    }
    const count = trap.trapped.size;
    this.trapToast.setText(`armadilha ativada  •  ${count} ${this.player.spec.label === 'cobra' ? 'caçador(es)' : 'caçador(es)'} preso(s) por 30s`);
    this.trapToast.setAlpha(1);
    this.tweens.add({ targets: this.trapToast, alpha: 0, delay: 2600, duration: 600 });
  }

  updateForceFields(now, delta = 16) {
    const alive = [];
    for (const f of this.forceFields) {
      if (!f.activated || now < f.until) alive.push(f);
      else if (f._label) f._label.destroy();
    }
    this.forceFields = alive;
    if (this.forceFields.length === 0) return;
    const p = this.player;
    const ATTRACT_RANGE = 420;
    for (const f of this.forceFields) {
      if (!p.dead) {
        const d = Math.hypot(p.x - f.x, p.y - f.y);
        if (d < f.radius) p.invulnerableUntil = Math.max(p.invulnerableUntil, now + 120);
      }
      if (f.armed) {
        let triggered = null;
        for (const a of this.animals) {
          if (a === p || a.dead || a.isPlayer) continue;
          if (!a.spec.eats.includes(p.type)) continue;
          const dx = f.x - a.x, dy = f.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d < f.radius) { triggered = a; break; }
          if (d < ATTRACT_RANGE && now >= a.stunnedUntil) {
            const nx = dx / d, ny = dy / d;
            const pullSpeed = a.spec.speed * 0.85;
            a.setPosition(a.x + nx * pullSpeed * (delta / 1000), a.y + ny * pullSpeed * (delta / 1000));
            a.facing = nx >= 0 ? 1 : -1;
          }
        }
        if (triggered) this.activateTrap(f, triggered, now);
      } else if (f.activated) {
        for (const hunter of f.trapped) {
          if (hunter.dead) continue;
          hunter.stunnedUntil = Math.max(hunter.stunnedUntil || 0, f.until);
          const dx = hunter.x - f.x, dy = hunter.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          const target = Math.max(2, f.radius - hunter.spec.radius);
          if (d > target) {
            const nx = dx / d, ny = dy / d;
            hunter.setPosition(f.x + nx * (target - 2), f.y + ny * (target - 2));
          }
        }
      }
    }
  }

  checkHunterLostPrey(now) {
    if (this.preyTarget) return;
    const player = this.player;
    if (player.dead) return;
    const hunters = this.animals.filter((a) => !a.isPlayer && !a.dead && a.spec.eats.includes(player.type));
    if (hunters.length === 0) return;
    const fields = this.forceFields.filter((f) => f.activated && now < f.until);
    const regionOf = (animal) => {
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        if (Math.hypot(animal.x - f.x, animal.y - f.y) < f.radius) return i;
      }
      return -1;
    };
    for (const hunter of hunters) {
      const hReg = regionOf(hunter);
      if (hReg < 0) continue;
      let hasPrey = false;
      for (const other of this.animals) {
        if (other.dead || other === hunter) continue;
        if (!hunter.spec.eats.includes(other.type)) continue;
        if (regionOf(other) === hReg) { hasPrey = true; break; }
      }
      if (!hasPrey) {
        this.showResult(true, `um ${hunter.spec.label} perdeu a presa — você venceu!`);
        return;
      }
    }
  }

  drawForceFields(now) {
    const g = this.forceFieldG;
    g.clear();
    for (const f of this.forceFields) {
      if (f.activated) {
        const remaining = f.until - now;
        const fade = Math.min(1, remaining / 1500);
        const pulse = 0.9 + 0.1 * Math.sin(now / 120 + f.bornAt);
        const R = f.radius * pulse;
        g.fillStyle(0xff5533, 0.18 * fade);
        g.fillCircle(f.x, f.y, R);
        g.lineStyle(4, 0xff5533, 0.85 * fade);
        g.strokeCircle(f.x, f.y, R);
        g.lineStyle(1, 0xffdd88, 0.6 * fade);
        g.strokeCircle(f.x, f.y, R - 6);
        const bars = 16;
        g.lineStyle(3, 0xff8844, 0.9 * fade);
        for (let i = 0; i < bars; i++) {
          const a = (i / bars) * Math.PI * 2;
          const x1 = f.x + Math.cos(a) * (R - 8);
          const y1 = f.y + Math.sin(a) * (R - 8);
          const x2 = f.x + Math.cos(a) * (R + 2);
          const y2 = f.y + Math.sin(a) * (R + 2);
          g.lineBetween(x1, y1, x2, y2);
        }
        const secs = Math.ceil(remaining / 1000);
        if (!f._label) {
          f._label = this.add.text(f.x, f.y - f.radius - 14, '', {
            fontFamily: 'system-ui, sans-serif', fontSize: '18px',
            color: '#ffffff', backgroundColor: '#9a3322cc', padding: { x: 6, y: 2 },
          }).setOrigin(0.5).setDepth(99998);
        }
        f._label.setText(`${secs}s`);
        f._label.setPosition(f.x, f.y - f.radius - 14);
        f._label.setVisible(true);
      } else if (f.armed) {
        const pulse = 0.88 + 0.12 * Math.sin(now / 180 + f.bornAt);
        const R = f.radius * pulse;
        g.fillStyle(0xffd966, 0.1);
        g.fillCircle(f.x, f.y, R);
        g.lineStyle(2, 0xffd966, 0.75);
        g.strokeCircle(f.x, f.y, R);
        g.lineStyle(1, 0xffffff, 0.5);
        g.strokeCircle(f.x, f.y, R - 5);
        const dashes = 20;
        g.lineStyle(2, 0xffe0a0, 0.8);
        const rot = now / 900;
        for (let i = 0; i < dashes; i += 2) {
          const a1 = rot + (i / dashes) * Math.PI * 2;
          const a2 = rot + ((i + 1) / dashes) * Math.PI * 2;
          g.beginPath();
          g.arc(f.x, f.y, R + 3, a1, a2);
          g.strokePath();
        }
        g.fillStyle(0xff4444, 0.7 + 0.3 * Math.sin(now / 120));
        g.fillCircle(f.x, f.y, 5);
      }
    }
  }

  drawHelpArrows(now) {
    const g = this.helpArrowG;
    g.clear();
    this.helpCalls = this.helpCalls.filter((c) => now < c.until && c.animal && !c.animal.dead);
    if (this.helpCalls.length === 0) return;
    const cam = this.cameras.main;
    const ccx = cam.scrollX + VIEW_W / 2;
    const ccy = cam.scrollY + VIEW_H / 2;
    for (const c of this.helpCalls) {
      const tx = c.animal.x, ty = c.animal.y;
      const dx = tx - ccx, dy = ty - ccy;
      const d = Math.hypot(dx, dy) || 1;
      const nx = dx / d, ny = dy / d;
      const remaining = c.until - now;
      const alpha = Math.min(1, remaining / 1000);
      const pulse = 1 + 0.15 * Math.sin(now / 90);
      const screenX = tx - cam.scrollX;
      const screenY = ty - cam.scrollY;
      const margin = 28;
      const onScreen = screenX > margin && screenX < VIEW_W - margin && screenY > margin && screenY < VIEW_H - margin;
      let ax, ay;
      if (onScreen) {
        ax = screenX;
        ay = screenY - 34 - Math.sin(now / 180) * 4;
      } else {
        const mx = VIEW_W / 2 - margin;
        const my = VIEW_H / 2 - margin;
        const sx = Math.abs(nx) > 1e-6 ? mx / Math.abs(nx) : Infinity;
        const sy = Math.abs(ny) > 1e-6 ? my / Math.abs(ny) : Infinity;
        const s = Math.min(sx, sy);
        ax = VIEW_W / 2 + nx * s;
        ay = VIEW_H / 2 + ny * s;
      }
      const angle = onScreen ? -Math.PI / 2 : Math.atan2(ny, nx);
      const size = 18 * pulse;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const tip = { x: ax + cos * size, y: ay + sin * size };
      const baseL = { x: ax - cos * size * 0.7 + (-sin) * size * 0.7, y: ay - sin * size * 0.7 + cos * size * 0.7 };
      const baseR = { x: ax - cos * size * 0.7 - (-sin) * size * 0.7, y: ay - sin * size * 0.7 - cos * size * 0.7 };
      g.fillStyle(0x000000, alpha * 0.5);
      g.fillTriangle(tip.x + 1, tip.y + 1, baseL.x + 1, baseL.y + 1, baseR.x + 1, baseR.y + 1);
      g.fillStyle(0x66ff99, alpha);
      g.fillTriangle(tip.x, tip.y, baseL.x, baseL.y, baseR.x, baseR.y);
      g.lineStyle(2, 0x1a5a2a, alpha);
      g.strokeTriangle(tip.x, tip.y, baseL.x, baseL.y, baseR.x, baseR.y);
    }
  }

  drawFlashes(delta) {
    this.fx.clear();
    this.flashes = this.flashes.filter((f) => {
      f.r += (f.maxR - f.r) * 0.18;
      f.alpha -= delta / 500;
      if (f.alpha <= 0) return false;
      this.fx.lineStyle(3, f.color, f.alpha);
      this.fx.strokeCircle(f.x, f.y, f.r);
      return true;
    });
  }

  handleEating(now) {
    const p = this.player;
    const pGiant = now < (p.giantUntil || 0);
    const pEffRadius = p.spec.radius * (pGiant ? 2.5 : 1);
    if (!p.dead) {
      for (const a of this.animals) {
        if (a === p || a.dead) continue;
        const d = Math.hypot(a.x - p.x, a.y - p.y);
        const touch = d < pEffRadius + a.spec.radius + 2;
        if (!touch) continue;
        const playerCanEat = canEat(p, a) || (p.contactEats && now < p.contactEatsUntil);
        const animalCanEatPlayer = canEat(a, p) && now >= p.invulnerableUntil;
        if (playerCanEat) {
          this.eat(p, a);
        } else if (animalCanEatPlayer) {
          this.eat(a, p);
          this.onPlayerDeath(a);
          return;
        }
      }
    }
    for (const a of this.animals) {
      if (a.isPlayer || a.dead || a.spec.eats.length === 0) continue;
      for (const b of this.animals) {
        if (b === a || b.isPlayer || b.dead) continue;
        if (!a.spec.eats.includes(b.type)) continue;
        if (now < (b.invulnerableUntil || 0)) continue;
        const d = Math.hypot(b.x - a.x, b.y - a.y);
        if (d < a.spec.radius + b.spec.radius + 2) {
          this.eat(a, b);
          break;
        }
      }
    }
  }

  eat(eater, victim) {
    victim.dead = true;
    this.flashRing(victim.x, victim.y, 30, 0xff6060);
    victim.container.destroy();
    this.animals = this.animals.filter((a) => a !== victim);
    this.killedByType[victim.type] = (this.killedByType[victim.type] || 0) + 1;
    if (!victim.isPlayer) {
      this.time.delayedCall(1500, () => this.spawnNpc(victim.type));
    }
    if (eater === this.player) {
      this.score += 1;
      if (this.preyTarget && this.score >= this.preyTarget && !this.gameOver) {
        this.showResult(true, `dominou o time — ${this.score}/${this.preyTotal} caçados!`);
      }
    }
  }

  onPlayerDeath(killer) {
    this.showResult(false, `você foi comido por ${killer.spec.label}`);
  }

  onTimeUp() {
    if (this.preyTarget) {
      if (this.score >= this.preyTarget) {
        this.showResult(true, `caçou o suficiente — ${this.score}/${this.preyTotal}!`);
      } else {
        this.showResult(false, `tempo esgotou — só ${this.score}/${this.preyTarget} presas`);
      }
    } else if (this.preyWinTarget) {
      const killed = this.killedByType[this.playerType] || 0;
      if (killed >= this.preyWinTarget) {
        this.showResult(true, `escapou! o predador caçou ${killed}/${this.preyTeamInitial} do seu time e você sobreviveu`);
      } else {
        this.showResult(false, `o predador só caçou ${killed}/${this.preyWinTarget} — ele precisava vencer pra você vencer`);
      }
    } else {
      this.showResult(true, 'tempo acabou — você sobreviveu!');
    }
  }

  showResult(won, message) {
    if (this.gameOver) return;
    this.gameOver = true;
    const title = won ? 'VITÓRIA' : 'DERROTA';
    const bg = won ? '#2d7a4aee' : '#9a2a2aee';
    this.add.text(VIEW_W / 2, VIEW_H / 2 - 60, title, {
      fontFamily: 'system-ui, sans-serif', fontSize: '54px', fontStyle: 'bold',
      color: '#ffffff', backgroundColor: bg, padding: { x: 22, y: 8 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100001);
    this.add.text(VIEW_W / 2, VIEW_H / 2 - 10, message, {
      fontFamily: 'system-ui, sans-serif', fontSize: '22px',
      color: '#ffffff', backgroundColor: '#00000099', padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100001);
    this.add.text(VIEW_W / 2, VIEW_H / 2 + 22,
      `presas comidas: ${this.score}   •   ✨ itens mágicos: ${this.itemsCollected || 0}${this.bonus ? `  (+${this.bonus} bônus)` : ''}`,
      { fontFamily: 'system-ui, sans-serif', fontSize: '20px', color: '#dddddd' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(100001);

    this.resultModeLabel = this.add.text(VIEW_W / 2, VIEW_H / 2 + 58, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '21px',
      color: '#ffffff', backgroundColor: '#2d4d36ee', padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100001);
    const refreshModeLine = () => {
      const m = GAME_MODES[this.mode];
      this.resultModeLabel.setText(`modo: ${m.label}  (m pra trocar)`);
    };
    refreshModeLine();

    this.add.text(VIEW_W / 2, VIEW_H / 2 + 92,
      'q = jogar de novo   •   p = escolher outro bicho',
      { fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#bfd3bf' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(100001);

    this.input.keyboard.removeAllListeners();
    this.input.keyboard.on('keydown-M', () => {
      const keys = Object.keys(GAME_MODES);
      const idx = keys.indexOf(this.mode);
      this.mode = keys[(idx + 1) % keys.length];
      refreshModeLine();
    });
    const replay = () => this.scene.restart({ playerType: this.playerType, mode: this.mode });
    this.input.keyboard.on('keydown-Q', replay);
    this.input.keyboard.on('keydown-ENTER', replay);
    this.input.keyboard.on('keydown-SPACE', replay);
    this.input.keyboard.on('keydown-P', () => this.scene.start('menu', { mode: this.mode }));
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('menu', { mode: this.mode }));
  }

  drawAbilityBar(now) {
    const g = this.abilityBar;
    g.clear();
    const w = 160, h = 8;
    const x = VIEW_W - w - 12, y = 12;
    const remaining = Math.max(0, this.abilityReadyAt - now);
    const ratio = 1 - remaining / this.player.spec.cooldown;
    g.fillStyle(0x000000, 0.6);
    g.fillRoundedRect(x, y, w, h + 18, 4);
    g.fillStyle(0x333a33, 1);
    g.fillRoundedRect(x + 4, y + 18, w - 8, h, 3);
    g.fillStyle(ratio >= 1 ? 0xffd966 : 0x66aa88, 1);
    g.fillRoundedRect(x + 4, y + 18, (w - 8) * ratio, h, 3);
    if (!this.abilityLabel) {
      this.abilityLabel = this.add.text(x + 6, y + 3, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '16px', color: '#ffffff',
      }).setScrollFactor(0).setDepth(100001);
    }
    this.abilityLabel.setText(`habilidade: ${this.player.spec.desc} (e/espaço)`);
    this.abilityLabel.setPosition(x + 6, y + 3);
  }

  drawGround() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x357d49, 0x357d49, 0x1f4d2c, 0x1f4d2c, 1);
    g.fillRect(0, 0, WORLD_W, WORLD_H);
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * WORLD_W;
      const y = Math.random() * WORLD_H;
      const r = 40 + Math.random() * 90;
      g.fillStyle(Math.random() < 0.5 ? COLORS.grassDark : COLORS.clearing, 0.35);
      g.fillCircle(x, y, r);
    }
    // florzinhas decorativas (puramente visual)
    const flowerColors = [0xffe14d, 0xff8fb0, 0xf4f4f4, 0xc9a0ff];
    for (let i = 0; i < 240; i++) {
      const x = Math.random() * WORLD_W;
      const y = Math.random() * WORLD_H;
      if (isInWater(x, y)) continue;
      const c = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      g.fillStyle(c, 0.9);
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        g.fillCircle(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 1.8);
      }
      g.fillStyle(0xffd54a, 1);
      g.fillCircle(x, y, 1.5);
    }
    g.setDepth(-1000);
  }

  drawRiver() {
    const g = this.add.graphics();
    g.fillStyle(COLORS.riverDeep, 1);
    const points = [];
    const segs = 24;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const x = t * WORLD_W;
      const y = WORLD_H * 0.55 + Math.sin(t * 6) * 160 + Math.cos(t * 3) * 60;
      points.push({ x, y });
    }
    const width = 70;
    g.beginPath();
    g.moveTo(points[0].x, points[0].y - width);
    for (const p of points) g.lineTo(p.x, p.y - width);
    for (let i = points.length - 1; i >= 0; i--) g.lineTo(points[i].x, points[i].y + width);
    g.closePath(); g.fillPath();
    g.fillStyle(COLORS.river, 1);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y - width + 10);
    for (const p of points) g.lineTo(p.x, p.y - width + 10);
    for (let i = points.length - 1; i >= 0; i--) g.lineTo(points[i].x, points[i].y + width - 10);
    g.closePath(); g.fillPath();
    // reflexos/brilho na água (puramente visual)
    g.fillStyle(0x9fd0ee, 0.3);
    for (let i = 2; i < points.length - 2; i += 2) {
      const p = points[i];
      g.fillEllipse(p.x, p.y - 14, 38, 7);
      g.fillEllipse(p.x + 34, p.y + 20, 26, 5);
    }
    g.setDepth(-500);
  }

  drawDecor() {
    const g = this.add.graphics();
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * WORLD_W;
      const y = Math.random() * WORLD_H;
      g.fillStyle(COLORS.bush, 0.9);
      const r = 8 + Math.random() * 10;
      g.fillCircle(x, y, r);
      g.fillCircle(x + r * 0.6, y - r * 0.3, r * 0.7);
      g.fillCircle(x - r * 0.5, y - r * 0.2, r * 0.6);
    }
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * WORLD_W;
      const y = Math.random() * WORLD_H;
      g.fillStyle(0xd1c48a, 0.6);
      g.fillCircle(x, y, 2 + Math.random() * 2);
    }
    g.setDepth(-300);
  }

  addVignette() {
    // escurecimento suave nas bordas (espaço de tela, não interfere na jogabilidade)
    const g = this.add.graphics().setScrollFactor(0).setDepth(99000);
    const W = VIEW_W, H = VIEW_H, b = 150, steps = 26, aMax = 0.34;
    for (let i = 0; i < steps; i++) {
      const a = aMax * (1 - i / steps);
      const o = b * (i / steps);
      const t = b / steps + 1;
      g.fillStyle(0x000000, a);
      g.fillRect(0, o, W, t);
      g.fillRect(0, H - o - t, W, t);
      g.fillRect(o, 0, t, H);
      g.fillRect(W - o - t, 0, t, H);
    }
  }

  drawTrees() {
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * WORLD_W;
      const y = Math.random() * WORLD_H;
      this.drawTree(x, y, 18 + Math.random() * 18);
    }
  }

  drawTree(x, y, size) {
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.25);
    shadow.fillEllipse(x + 4, y + size * 0.3, size * 2.1, size * 0.7);
    shadow.setDepth(y - 10);
    const trunk = this.add.graphics();
    trunk.fillStyle(COLORS.trunk, 1);
    trunk.fillRect(x - size * 0.15, y - size * 0.2, size * 0.3, size * 0.6);
    trunk.setDepth(y);
    const leaves = this.add.graphics();
    const palette = [COLORS.leavesA, COLORS.leavesB, COLORS.leavesC];
    const cx = x, cy = y - size * 0.6;
    leaves.fillStyle(palette[Math.floor(Math.random() * palette.length)], 1);
    leaves.fillCircle(cx, cy, size);
    leaves.fillStyle(palette[Math.floor(Math.random() * palette.length)], 1);
    leaves.fillCircle(cx - size * 0.6, cy + size * 0.2, size * 0.8);
    leaves.fillCircle(cx + size * 0.6, cy + size * 0.2, size * 0.8);
    leaves.fillCircle(cx, cy - size * 0.5, size * 0.7);
    // brilho de luz na copa (puramente visual)
    leaves.fillStyle(0xffffff, 0.12);
    leaves.fillCircle(cx - size * 0.3, cy - size * 0.35, size * 0.5);
    leaves.setDepth(y + 1);
  }

  spawnPowerup() {
    let x, y, tries = 0;
    do {
      x = 120 + Math.random() * (WORLD_W - 240);
      y = 120 + Math.random() * (WORLD_H - 240);
      tries++;
    } while ((isInWater(x, y) || (this.player && Math.hypot(x - this.player.x, y - this.player.y) < 220)) && tries < 12);
    const def = POWERUP_KINDS[Math.floor(Math.random() * POWERUP_KINDS.length)];
    this.powerups.push({ x, y, def, phase: Math.random() * Math.PI * 2 });
  }

  drawPowerups(now) {
    const g = this.powerupG;
    g.clear();
    for (const p of this.powerups) {
      const bob = Math.sin(now / 320 + p.phase) * 6;
      const py = p.y + bob;
      const pulse = 0.5 + 0.5 * Math.sin(now / 250 + p.phase);
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(p.x, p.y + 15, 26, 8);
      g.fillStyle(p.def.glow, 0.22 + pulse * 0.2);
      g.fillCircle(p.x, py, 17 + pulse * 4);
      drawPowerupIcon(g, p.def.kind, p.x, py, 11);
    }
  }

  checkPowerups(now) {
    const reach = this.player.spec.radius + 20;
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      if (Math.hypot(p.x - this.player.x, p.y - this.player.y) <= reach) {
        this.collectPowerup(p, now);
        this.powerups.splice(i, 1);
        this.time.delayedCall(5000, () => { if (!this.gameOver) this.spawnPowerup(); });
      }
    }
  }

  collectPowerup(p, now) {
    const k = p.def.kind;
    this.itemsCollected = (this.itemsCollected || 0) + 1;
    if (k === 'apple') {
      this.player.speedMult = 1.7; this.player.speedMultUntil = now + 6000;
      this.itemBuffName = 'turbo'; this.itemBuffUntil = now + 6000;
    } else if (k === 'shield') {
      this.player.invulnerableUntil = Math.max(this.player.invulnerableUntil, now + 5000);
      this.itemBuffName = 'escudo'; this.itemBuffUntil = now + 5000;
    } else if (k === 'bolt') {
      this.abilityReadyAt = now;
      if (this.giantReadyAt) this.giantReadyAt = now;
    } else if (k === 'gem') {
      this.bonus = (this.bonus || 0) + 5;
    }
    this.floatText(p.x, p.y - 10, p.def.name, '#ffffff');
  }

  floatText(x, y, msg, color) {
    const t = this.add.text(x, y, msg, {
      fontFamily: 'system-ui, sans-serif', fontSize: '20px', color,
      fontStyle: 'bold', stroke: '#0a140d', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100050);
    this.tweens.add({ targets: t, y: y - 54, alpha: 0, duration: 1100, ease: 'Cubic.Out', onComplete: () => t.destroy() });
  }

  generateGrass() {
    this.grassPatches = [];
    for (let i = 0; i < 22; i++) {
      let x, y, tries = 0;
      do {
        x = 150 + Math.random() * (WORLD_W - 300);
        y = 150 + Math.random() * (WORLD_H - 300);
        tries++;
      } while (isInWater(x, y) && tries < 10);
      this.grassPatches.push({ x, y, r: 70 + Math.random() * 55 });
    }
  }

  drawGrassPatches() {
    const g = this.grassG;
    for (const patch of this.grassPatches) {
      g.fillStyle(0x1e5a2a, 0.45);
      g.fillCircle(patch.x, patch.y, patch.r);
      const blades = Math.floor(patch.r * 0.8);
      for (let i = 0; i < blades; i++) {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.random() * patch.r;
        const bx = patch.x + Math.cos(a) * rr;
        const by = patch.y + Math.sin(a) * rr;
        const h = 10 + Math.random() * 16;
        g.fillStyle(Math.random() < 0.5 ? 0x2e7a3a : 0x256b30, 0.85);
        g.fillTriangle(bx - 2, by, bx + 2, by, bx + (Math.random() * 4 - 2), by - h);
      }
    }
  }

  updateHiding() {
    for (const a of this.animals) {
      let hid = false;
      for (const patch of this.grassPatches) {
        if (Math.hypot(a.x - patch.x, a.y - patch.y) < patch.r) { hid = true; break; }
      }
      a.isHidden = hid;
    }
  }

  envSpeedMult(animal) {
    let m = 1;
    if (this.isNight && NOCTURNAL.has(animal.type)) m *= 1.15;
    if (this.raining && animal.type !== 'capybara') m *= 0.9;
    return m;
  }

  updateSprint(delta) {
    const dt = delta / 1000;
    if (this.shiftKey && this.shiftKey.isDown && this.stamina > 1) {
      this.sprintMult = 1.6;
      this.stamina = Math.max(0, this.stamina - 38 * dt);
    } else {
      this.sprintMult = 1;
      this.stamina = Math.min(this.staminaMax, this.stamina + 22 * dt);
    }
  }

  drawStaminaBar() {
    const g = this.staminaBar;
    g.clear();
    const w = 160, h = 8, x = VIEW_W - w - 12, y = 44;
    g.fillStyle(0x000000, 0.6);
    g.fillRoundedRect(x, y, w, h + 18, 4);
    g.fillStyle(0x333a33, 1);
    g.fillRoundedRect(x + 4, y + 18, w - 8, h, 3);
    const ratio = this.stamina / this.staminaMax;
    g.fillStyle(ratio > 0.3 ? 0x66ccaa : 0xcc6666, 1);
    g.fillRoundedRect(x + 4, y + 18, (w - 8) * ratio, h, 3);
    if (!this.staminaLabel) {
      this.staminaLabel = this.add.text(x + 6, y + 3, 'fôlego (shift = correr)', {
        fontFamily: 'system-ui, sans-serif', fontSize: '16px', color: '#ffffff',
      }).setScrollFactor(0).setDepth(100001);
    }
  }

  drawRain(now) {
    const g = this.rainG;
    g.clear();
    if (!this.raining) return;
    g.fillStyle(0x3a5a7a, 0.12);
    g.fillRect(0, 0, VIEW_W, VIEW_H);
    g.lineStyle(2, 0xbfe0ff, 0.38);
    for (let i = 0; i < 150; i++) {
      const x = (i * 97) % VIEW_W;
      const yBase = (i * 53) % VIEW_H;
      const y = (yBase + now * 0.7) % VIEW_H;
      g.lineBetween(x, y, x - 7, y + 18);
    }
  }

  updateDigTrails(now) {
    for (const a of this.animals) {
      if (now < (a.digUntil || 0) && now - (a.lastDigMark || 0) > 70) {
        this.digMarks.push({ x: a.x, y: a.y, t: now });
        a.lastDigMark = now;
      }
    }
    const g = this.digG;
    g.clear();
    for (let i = this.digMarks.length - 1; i >= 0; i--) {
      const m = this.digMarks[i];
      const age = now - m.t;
      if (age > 1300) { this.digMarks.splice(i, 1); continue; }
      const k = 1 - age / 1300;
      g.fillStyle(0x4a3418, 0.5 * k);
      g.fillEllipse(m.x, m.y + 2, 24, 12);
      g.fillStyle(0x6a4a2a, 0.6 * k);
      g.fillCircle(m.x - 6, m.y - 2, 4);
      g.fillCircle(m.x + 5, m.y - 3, 5);
      g.fillCircle(m.x + 1, m.y + 2, 4);
      g.fillStyle(0x7a5a36, 0.6 * k);
      g.fillCircle(m.x - 2, m.y - 4, 3);
    }
  }

  updateEnvironment(now) {
    const elapsed = now - this.gameStartTime;
    const cycle = 70000;
    const t = (elapsed % cycle) / cycle;
    const darkness = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
    this.isNight = darkness > 0.45;
    this.nightOverlay.clear();
    this.nightOverlay.fillStyle(0x0a1430, darkness * 0.55);
    this.nightOverlay.fillRect(0, 0, VIEW_W, VIEW_H);
    this.raining = (elapsed % 45000) < 12000;
    this.drawRain(now);
  }

  updateHud(now) {
    const nearby = this.animals
      .filter((a) => !a.isPlayer && !a.dead && Math.hypot(a.x - this.player.x, a.y - this.player.y) < 200)
      .map((a) => a.spec.label);
    const counts = nearby.reduce((m, l) => (m[l] = (m[l] || 0) + 1, m), {});
    const near = Object.entries(counts).map(([k, v]) => `${k}×${v}`).join('  ') || '—';
    const remaining = Math.max(0, Math.ceil((this.gameDuration - (now - this.gameStartTime)) / 1000));
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    const swimming = this.player.type === 'capybara' && isInWater(this.player.x, this.player.y);
    const swimTag = swimming ? '   •   🌊 nadando (+100%)' : '';
    const buffTag = now < (this.itemBuffUntil || 0)
      ? `   •   ✨ ${this.itemBuffName} (${Math.ceil((this.itemBuffUntil - now) / 1000)}s)` : '';
    const timeTag = this.isNight ? '   •   🌙 noite' : '   •   ☀️ dia';
    const rainTag = this.raining ? '   •   🌧️ chuva' : '';
    const hideTag = this.player.isHidden ? '   •   🌿 escondido' : '';
    const teamKilled = this.killedByType[this.playerType] || 0;
    const scoreText = this.preyTarget
      ? `caça: ${this.score}/${this.preyTarget} (meta pra vencer)`
      : this.preyWinTarget
      ? `seu time caçado: ${teamKilled}/${this.preyWinTarget} (precisa pro predador vencer)`
      : `comidos: ${this.score}`;
    const isPredator = this.player.spec.eats.length > 0;
    let fKeyInfo;
    if (isPredator) {
      const giantLeft = Math.max(0, Math.ceil(((this.player.giantUntil || 0) - now) / 1000));
      const cdLeft = Math.max(0, Math.ceil(((this.giantReadyAt || 0) - now) / 1000));
      fKeyInfo = giantLeft > 0
        ? `f=gigante ativo (${giantLeft}s)`
        : cdLeft > 0 ? `f=gigante (recarga ${cdLeft}s)` : `f=gigante`;
    } else {
      const fields = this.forceFields || [];
      const armed = fields.filter((f) => f.armed).length;
      const active = fields.filter((f) => f.activated && now < f.until).length;
      fKeyInfo = `f=armadilha (armada ${armed}  ativada ${active}  /  máx ${this.forceFieldMax})`;
    }
    this.hud.setText(
      `você é ${this.player.spec.label}   •   modo: ${GAME_MODES[this.mode]?.label || this.mode}   •   tempo: ${mm}:${ss}${swimTag}${buffTag}${timeTag}${rainTag}${hideTag}\n` +
      `wasd  shift=correr  e=habilidade  ${fKeyInfo}  b=isca  v=avisar  n=ajuda  h=base  p/esc=menu\n` +
      `${scoreText}   •   ✨ itens: ${this.itemsCollected || 0}${this.bonus ? ` (+${this.bonus} bônus)` : ''}   •   por perto: ${near}`
    );
  }

  update(_, delta) {
    const now = this.time.now;
    this.updateHiding();
    this.updateSprint(delta);
    let dx = 0, dy = 0;
    if (!this.passageMenuOpen) {
      if (this.cursors.left.isDown || this.wasd.A.isDown) dx -= 1;
      if (this.cursors.right.isDown || this.wasd.D.isDown) dx += 1;
      if (this.cursors.up.isDown || this.wasd.W.isDown) dy -= 1;
      if (this.cursors.down.isDown || this.wasd.S.isDown) dy += 1;
    }
    this.player.updatePlayer(dx, dy, delta, now);

    for (const a of this.animals) {
      if (!a.isPlayer) a.updateNpc(delta, now, this.player);
    }

    if (!this.gameOver && !this.passageMenuOpen) this.handleEating(now);
    if (!this.gameOver && !this.passageMenuOpen) this.checkPowerups(now);
    if (!this.gameOver && !this.passageMenuOpen && now - this.gameStartTime >= this.gameDuration) this.onTimeUp();

    this.nearbyPassage = this.nearbyPassageFor(this.player.x, this.player.y);
    if (!this.passageMenuOpen) {
      if (this.nearbyPassage) {
        this.passageHint.setVisible(true);
        this.passageHint.setText(`passagem secreta da base ${ANIMAL_TYPES[this.nearbyPassage.type].label}  •  g pra entrar`);
      } else {
        this.passageHint.setVisible(false);
      }
    }

    this.updateForceFields(now, delta);
    this.drawForceFields(now);
    this.drawPowerups(now);
    this.updateDigTrails(now);
    this.updateEnvironment(now);
    this.drawStaminaBar();
    if (!this.gameOver && !this.passageMenuOpen) this.checkHunterLostPrey(now);
    this.drawFlashes(delta);
    this.drawAbilityBar(now);
    this.drawHelpArrows(now);
    if (this.passageMenuOpen) this.renderPassageMenu();
    this.updateHud(now);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW_W,
  height: VIEW_H,
  backgroundColor: '#1a2e1a',
  scene: [MenuScene, AnimapediaScene, ForestScene],
  pixelArt: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: VIEW_W,
    height: VIEW_H,
  },
  render: {
    antialias: true,
    antialiasGL: true,
    roundPixels: false,
    powerPreference: 'high-performance',
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    batchSize: 36864,
  },
});
