import { createCard, init } from '../rikishi-card-manager.js';

test('createCard creates valid HTML element', () => {
  const card = createCard('Y1e Hoshoryu 8-7', 12451, '202301');
  
  assert(card instanceof HTMLElement, 'Should return HTML element');
  assertEquals(card.tagName, 'DIV', 'Should be a div element');
  assertEquals(card.getAttribute('id'), 'Y1e', 'Should have correct id');
  assertEquals(card.getAttribute('data-rid'), '12451', 'Should have rikishi id');
});

test('createCard includes rikishi links', () => {
  const card = createCard('Y1e Hoshoryu 8-7', 12451, '202301');
  const html = card.innerHTML;
  
  assert(html.includes('href="https://sumodb.sumogames.de/Rikishi.aspx?r=12451"'), 
    'Should include rikishi info link');
  assert(html.includes('href="https://sumodb.sumogames.de/Rikishi_basho.aspx?r=12451&b=202301"'), 
    'Should include basho record link');
  assert(html.includes('target="_blank"'), 'Links should open in new tab');
});

test('createCard sets correct drag class for active rikishi', () => {
  // Clear retired rikishi first
  localStorage.removeItem('retiredRikishi');
  
  const card = createCard('Y1e Hoshoryu 8-7', 12451, '202301');
  assertEquals(card.className, 'redips-drag se', 'Active rikishi should be draggable');
  assertEquals(card.style.cursor, 'grab', 'Should have grab cursor');
});

test('init runs migration', () => {
  // Clear migration flag
  localStorage.removeItem('retiredMigrationDone');
  localStorage.removeItem('retiredRikishi');
  
  init();
  
  assertEquals(localStorage.getItem('retiredMigrationDone'), 'true', 
    'Migration should be marked as done');
});

test('card has contextmenu event listener', () => {
  const card = createCard('Y1e Hoshoryu 8-7', 12451, '202301');
  
  // Check if contextmenu event is handled
  let eventFired = false;
  const originalPreventDefault = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function() {
    eventFired = true;
    originalPreventDefault.call(this);
  };
  
  const event = new Event('contextmenu');
  card.dispatchEvent(event);
  
  assert(eventFired, 'Context menu event should be prevented');
  
  // Restore original
  Event.prototype.preventDefault = originalPreventDefault;
});