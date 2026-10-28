export const PERSISTENT_REPLY_KEYBOARD_EN = {
  keyboard: [
    [
      { text: '🎛️ Menu' },
      { text: '📊 Progress' },
      { text: '🌐 العربية 🇪🇬' },
      { text: '📱 Console', web_app: { url: 'https://aim.getvintel.com' } }
    ]
  ],
  resize_keyboard: true,
  is_persistent: true,
};

export const PERSISTENT_REPLY_KEYBOARD_AR = {
  keyboard: [
    [
      { text: '🎛️ القائمة' },
      { text: '📊 التقدم' },
      { text: '🌐 English 🇬🇧' },
      { text: '📱 لوحة التحكم', web_app: { url: 'https://aim.getvintel.com' } }
    ]
  ],
  resize_keyboard: true,
  is_persistent: true,
};

export const PERSISTENT_REPLY_KEYBOARD = PERSISTENT_REPLY_KEYBOARD_EN;
