const $_forTrack0$ = ($index, $item) => $item.name[0].toUpperCase();
…
function MyApp_Template(rf, ctx) {
  if (rf & 1) {
    $r3$.ɵɵrepeaterCreate(0, MyApp_For_1_Template, 1, 1, $_forTrack0$);
    $r3$.ɵɵrepeaterCreate(2, MyApp_For_3_Template, 1, 1, $_forTrack0$);
  }
  if (rf & 2) {
    $r3$.ɵɵrepeater(0, ctx.items);
    $r3$.ɵɵrepeater(2, ctx.otherItems);
  }
}
