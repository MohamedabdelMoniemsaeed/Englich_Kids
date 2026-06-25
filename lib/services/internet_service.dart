import 'package:http/http.dart' as http;

class InternetService {
  static Future<bool> hasInternet() async {
    try {
      final response = await http.get(
        Uri.parse('https://www.google.com'),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

