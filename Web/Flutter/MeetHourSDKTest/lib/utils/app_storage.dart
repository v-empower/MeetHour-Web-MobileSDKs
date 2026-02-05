import 'package:flutter/foundation.dart';
import 'package:web/web.dart' as web;

class AppStorage {
  AppStorage._();

  static final Map<String, String> _memoryStore = <String, String>{};

  static web.Storage? get _localStorage {
    if (!kIsWeb) {
      return null;
    }
    return web.window.localStorage;
  }

  static Future<String?> getString(String key) async {
    final storage = _localStorage;
    if (storage == null) {
      return _memoryStore[key];
    }
    final value = storage.getItem(key);
    return value ?? _memoryStore[key];
  }

  static Future<void> setString(String key, String value) async {
    final storage = _localStorage;
    if (storage == null) {
      _memoryStore[key] = value;
      return;
    }
    storage.setItem(key, value);
  }

  static Future<void> remove(String key) async {
    final storage = _localStorage;
    if (storage == null) {
      _memoryStore.remove(key);
      return;
    }
    storage.removeItem(key);
  }
}
