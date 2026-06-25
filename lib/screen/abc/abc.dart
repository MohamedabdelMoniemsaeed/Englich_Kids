import 'package:carousel_slider/carousel_slider.dart';
import 'package:englich_kids/models/abc/data_Abc.dart';
import 'package:englich_kids/models/abc/image_Abc.dart';
import 'package:englich_kids/models/abc/sound_Abc.dart';
import 'package:englich_kids/screen/widgets_details/abc_Details.dart';
import 'package:flutter/material.dart';


class AbcScreen extends StatefulWidget {
  const AbcScreen({super.key});

  @override
  State<AbcScreen> createState() => _AbcScreenState();
}

class _AbcScreenState extends State<AbcScreen> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    // ignore: unused_local_variable
    int indexs = 0;
    List<AbcDetails> item = [
      AbcDetails(
          imageAbc: ImageAbc.a,
          abc: DataAbc.a,
          nameEnglish: DataAbc.apple,
          sound: SoundAbc.a),
      AbcDetails(
          imageAbc: ImageAbc.b,
          abc: DataAbc.b,
          nameEnglish: DataAbc.book,
          sound: SoundAbc.b),
      AbcDetails(
          imageAbc: ImageAbc.c,
          abc: DataAbc.c,
          nameEnglish: DataAbc.cat,
          sound: SoundAbc.c),
      AbcDetails(
          imageAbc: ImageAbc.d,
          abc: DataAbc.d,
          nameEnglish: DataAbc.dog,
          sound: SoundAbc.d),
      AbcDetails(
          imageAbc: ImageAbc.e,
          abc: DataAbc.e,
          nameEnglish: DataAbc.egg,
          sound: SoundAbc.e),
      AbcDetails(
          imageAbc: ImageAbc.f,
          abc: DataAbc.f,
          nameEnglish: DataAbc.fish,
          sound: SoundAbc.f),
      AbcDetails(
          imageAbc: ImageAbc.g,
          abc: DataAbc.g,
          nameEnglish: DataAbc.girl,
          sound: SoundAbc.g),
      AbcDetails(
          imageAbc: ImageAbc.h,
          abc: DataAbc.h,
          nameEnglish: DataAbc.horse,
          sound: SoundAbc.h),
      AbcDetails(
          imageAbc: ImageAbc.i,
          abc: DataAbc.i,
          nameEnglish: DataAbc.icecream,
          sound: SoundAbc.i),
      AbcDetails(
          imageAbc: ImageAbc.j,
          abc: DataAbc.j,
          nameEnglish: DataAbc.juice,
          sound: SoundAbc.j),
      AbcDetails(
          imageAbc: ImageAbc.k,
          abc: DataAbc.k,
          nameEnglish: DataAbc.key,
          sound: SoundAbc.k),
      AbcDetails(
          imageAbc: ImageAbc.l,
          abc: DataAbc.l,
          nameEnglish: DataAbc.lion,
          sound: SoundAbc.l),
      AbcDetails(
          imageAbc: ImageAbc.m,
          abc: DataAbc.m,
          nameEnglish: DataAbc.monkey,
          sound: SoundAbc.m),
      AbcDetails(
          imageAbc: ImageAbc.n,
          abc: DataAbc.n,
          nameEnglish: DataAbc.nurse,
          sound: SoundAbc.n),
      AbcDetails(
          imageAbc: ImageAbc.o,
          abc: DataAbc.o,
          nameEnglish: DataAbc.orange,
          sound: SoundAbc.o),
      AbcDetails(
          imageAbc: ImageAbc.p,
          abc: DataAbc.p,
          nameEnglish: DataAbc.pen,
          sound: SoundAbc.p),
      AbcDetails(
          imageAbc: ImageAbc.q,
          abc: DataAbc.q,
          nameEnglish: DataAbc.queen,
          sound: SoundAbc.q),
      AbcDetails(
          imageAbc: ImageAbc.r,
          abc: DataAbc.r,
          nameEnglish: DataAbc.rabbit,
          sound: SoundAbc.r),
      AbcDetails(
          imageAbc: ImageAbc.s,
          abc: DataAbc.s,
          nameEnglish: DataAbc.sun,
          sound: SoundAbc.s),
      AbcDetails(
          imageAbc: ImageAbc.t,
          abc: DataAbc.t,
          nameEnglish: DataAbc.tree,
          sound: SoundAbc.t),
      AbcDetails(
          imageAbc: ImageAbc.u,
          abc: DataAbc.u,
          nameEnglish: DataAbc.umbrella,
          sound: SoundAbc.u),
      AbcDetails(
          imageAbc: ImageAbc.v,
          abc: DataAbc.v,
          nameEnglish: DataAbc.vazza,
          sound: SoundAbc.v),
      AbcDetails(
          imageAbc: ImageAbc.w,
          abc: DataAbc.w,
          nameEnglish: DataAbc.watch,
          sound: SoundAbc.w),
      AbcDetails(
          imageAbc: ImageAbc.x,
          abc: DataAbc.x,
          nameEnglish: DataAbc.xylophone,
          sound: SoundAbc.x),
      AbcDetails(
          imageAbc: ImageAbc.y,
          abc: DataAbc.y,
          nameEnglish: DataAbc.yellow,
          sound: SoundAbc.y),
      AbcDetails(
          imageAbc: ImageAbc.z,
          abc: DataAbc.z,
          nameEnglish: DataAbc.zoo,
          sound: SoundAbc.z),
    ];
    return Scaffold(
        backgroundColor: Theme.of(context).primaryColor,
        appBar: AppBar(
          title: const Text(
            'A B C',
            style: TextStyle(),
          ),
        ),
        body: CarouselSlider(
          options: CarouselOptions(
            viewportFraction: 1,
            enlargeCenterPage: true,
            enlargeFactor: 0.2,
            onPageChanged: (index, reason) => setState(() => indexs = index),
            scrollDirection: Axis.horizontal,
            height: size.height,
          ),
          items: item
              .map((e) => AbcDetails(
                    imageAbc: e.imageAbc,
                    abc: e.abc,
                    nameEnglish: e.nameEnglish,
                    sound: e.sound,
                  ))
              .toList(),
        ));
  }
}


