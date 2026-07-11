import 'package:englich_kids/services/internet_service.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class HomeBannerAd extends StatefulWidget {
  const HomeBannerAd({super.key});

  @override
  State<HomeBannerAd> createState() => _HomeBannerAdState();
}

class _HomeBannerAdState extends State<HomeBannerAd> {
  static const String _primaryAdUnitId =
      'ca-app-pub-3841714693406145/5436062020';
  static const String _testAdUnitId = 'ca-app-pub-3940256099942544/6300978111';

  BannerAd? _bannerAd;
  bool _isLoaded = false;
  bool _hasInternet = true;
  bool _hasFailed = false;
  String _activeAdUnitId = _primaryAdUnitId;

  @override
  void initState() {
    super.initState();
    _loadAd();
  }

  Future<void> _loadAd() async {
    final hasInternet = await InternetService.hasInternet();

    if (!mounted) return;

    setState(() {
      _hasInternet = hasInternet;
    });

    if (!hasInternet) {
      _bannerAd?.dispose();
      setState(() {
        _isLoaded = false;
        _bannerAd = null;
      });
      return;
    }

    _bannerAd?.dispose();
    _bannerAd = BannerAd(
      adUnitId: _activeAdUnitId,
      request: const AdRequest(),
      size: AdSize.banner,
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          if (!mounted) return;
          setState(() {
            _isLoaded = true;
          });
        },
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
          debugPrint('Home banner failed to load: $error');

          if (!mounted) return;

          if (_activeAdUnitId == _primaryAdUnitId) {
            setState(() {
              _activeAdUnitId = _testAdUnitId;
              _isLoaded = false;
              _bannerAd = null;
            });
            _loadAd();
            return;
          }

          setState(() {
            _hasFailed = true;
            _isLoaded = false;
            _bannerAd = null;
          });
        },
      ),
    )..load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_hasInternet) {
      return const SizedBox.shrink();
    }

    return Container(
      height: 60,
      width: double.infinity,
      color: Colors.black.withOpacity(0.75),
      alignment: Alignment.center,
      child: _hasFailed
          ? const Center(
              child: Text(
                'Ad unavailable',
                style: TextStyle(color: Colors.white, fontSize: 12),
              ),
            )
          : _isLoaded && _bannerAd != null
          ? SizedBox(
              width: _bannerAd!.size.width.toDouble(),
              height: _bannerAd!.size.height.toDouble(),
              child: AdWidget(ad: _bannerAd!),
            )
          : const Center(
              child: Text(
                'Loading ad...',
                style: TextStyle(color: Colors.white, fontSize: 12),
              ),
            ),
    );
  }
}
