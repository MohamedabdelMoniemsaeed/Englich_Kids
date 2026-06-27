import 'package:carousel_slider/carousel_slider.dart';
import 'package:englich_kids/models/abc/data_Abc.dart';
import 'package:englich_kids/models/abc/image_Abc.dart';
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
      ),
      AbcDetails(
        imageAbc: ImageAbc.b,
        abc: DataAbc.b,
        nameEnglish: DataAbc.book,
      ),
      AbcDetails(
        imageAbc: ImageAbc.c,
        abc: DataAbc.c,
        nameEnglish: DataAbc.cat,
      ),
      AbcDetails(
        imageAbc: ImageAbc.d,
        abc: DataAbc.d,
        nameEnglish: DataAbc.dog,
      ),
      AbcDetails(
        imageAbc: ImageAbc.e,
        abc: DataAbc.e,
        nameEnglish: DataAbc.egg,
      ),
      AbcDetails(
        imageAbc: ImageAbc.f,
        abc: DataAbc.f,
        nameEnglish: DataAbc.fish,
      ),
      AbcDetails(
        imageAbc: ImageAbc.g,
        abc: DataAbc.g,
        nameEnglish: DataAbc.girl,
      ),
      AbcDetails(
        imageAbc: ImageAbc.h,
        abc: DataAbc.h,
        nameEnglish: DataAbc.horse,
      ),
      AbcDetails(
        imageAbc: ImageAbc.i,
        abc: DataAbc.i,
        nameEnglish: DataAbc.icecream,
      ),
      AbcDetails(
        imageAbc: ImageAbc.j,
        abc: DataAbc.j,
        nameEnglish: DataAbc.juice,
      ),
      AbcDetails(
        imageAbc: ImageAbc.k,
        abc: DataAbc.k,
        nameEnglish: DataAbc.key,
      ),
      AbcDetails(
        imageAbc: ImageAbc.l,
        abc: DataAbc.l,
        nameEnglish: DataAbc.lion,
      ),
      AbcDetails(
        imageAbc: ImageAbc.m,
        abc: DataAbc.m,
        nameEnglish: DataAbc.monkey,
      ),
      AbcDetails(
        imageAbc: ImageAbc.n,
        abc: DataAbc.n,
        nameEnglish: DataAbc.nurse,
      ),
      AbcDetails(
        imageAbc: ImageAbc.o,
        abc: DataAbc.o,
        nameEnglish: DataAbc.orange,
      ),
      AbcDetails(
        imageAbc: ImageAbc.p,
        abc: DataAbc.p,
        nameEnglish: DataAbc.pen,
      ),
      AbcDetails(
        imageAbc: ImageAbc.q,
        abc: DataAbc.q,
        nameEnglish: DataAbc.queen,
      ),
      AbcDetails(
        imageAbc: ImageAbc.r,
        abc: DataAbc.r,
        nameEnglish: DataAbc.rabbit,
      ),
      AbcDetails(
        imageAbc: ImageAbc.s,
        abc: DataAbc.s,
        nameEnglish: DataAbc.sun,
      ),
      AbcDetails(
        imageAbc: ImageAbc.t,
        abc: DataAbc.t,
        nameEnglish: DataAbc.tree,
      ),
      AbcDetails(
        imageAbc: ImageAbc.u,
        abc: DataAbc.u,
        nameEnglish: DataAbc.umbrella,
      ),
      AbcDetails(
        imageAbc: ImageAbc.v,
        abc: DataAbc.v,
        nameEnglish: DataAbc.vazza,
      ),
      AbcDetails(
        imageAbc: ImageAbc.w,
        abc: DataAbc.w,
        nameEnglish: DataAbc.watch,
      ),
      AbcDetails(
        imageAbc: ImageAbc.x,
        abc: DataAbc.x,
        nameEnglish: DataAbc.xylophone,
      ),
      AbcDetails(
        imageAbc: ImageAbc.y,
        abc: DataAbc.y,
        nameEnglish: DataAbc.yellow,
      ),
      AbcDetails(
        imageAbc: ImageAbc.z,
        abc: DataAbc.z,
        nameEnglish: DataAbc.zoo,
      ),
    ];
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      appBar: AppBar(title: const Text('A B C', style: TextStyle())),
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
            .map(
              (e) => AbcDetails(
                imageAbc: e.imageAbc,
                abc: e.abc,
                nameEnglish: e.nameEnglish,
              ),
            )
            .toList(),
      ),
    );
  }
}
