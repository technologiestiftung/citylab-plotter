(function(thisObj) {

/*! monoline-text.jsx - v0.2.2 - 2018-07-02 */
/****************************************************************
 * inspired by the incredible jongware
 * Have a look @ http://forums.adobe.com/message/4907404#4907404
 *
 *
 * and of course the marvelous Dr. A. V. Hershey
 * http://en.wikipedia.org/wiki/Hershey_font
 * Hershey fonts are under hershey license
 *
 *
 * USE RESTRICTION:
 *  This distribution of the Hershey Fonts may be used by anyone for
 *  any purpose, commercial or otherwise, providing that:
 *      1. The following acknowledgements must be distributed with
 *          the font data:
 *          - The Hershey Fonts were originally created by Dr.
 *              A. V. Hershey while working at the U. S.
 *              National Bureau of Standards.
 *          - The format of the Font data in this distribution
 *              was originally created by
 *                  James Hurt
 *                  Cognition, Inc.
 *                  900 Technology Park Drive
 *                  Billerica, MA 01821
 *                  (mit-eddie!ci-dandelion!hurt)
 *      2. The font data in this distribution may be converted into
 *          any other format *EXCEPT* the format distributed by
 *          the U.S. NTIS (which organization holds the rights
 *          to the distribution and use of the font data in that
 *          particular format). Not that anybody would really
 *          *want* to use their format... each point is described
 *          in eight bytes as "xxx yyy:", where xxx and yyy are
 *          the coordinate values as ASCII numbers.
 *
 *
 *
 *
 *
 *
 *
 * btw. Its awesome that you are reading the source code!
 * feel free to ask me anything about it.
 *
 * Copyright (c) 2013 - 218
 * Fabian "fabiantheblind" Morón Zirfas
 * Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to  permit persons to
 * whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTIO
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * see also http://www.opensource.org/licenses/mit-license.php
********************************************************************/

var v = '0.2.2';

run_monoline_text(thisObj);

function run_monoline_text(thisObj){

String.prototype.ftb_trim = function() {
  return this.replace(/\s+$/g, "");
};
var ux = {
'aboutRovKeys' : false,
'rwAccess' : false,
'norovkeywwarning':false,
'messages':{
  'rovKey':'rovkeywarning',
  'rwAccess': "To use the script you need to allow the script to read and write to disk. There is no data stored the only thing that happens is the creation of the icons for the tool-buttons.\nGo to  Edit > Preferences > General (Windows) or After Effects > Preferences > General (Mac OS), and select the Allow Scripts To Write Files And Access Network option.\nRead more about it there --> http://help.adobe.com/en_US/aftereffects/cs/using/WSD2616887-A41E-4a39-85FE-957B9D2D3843.html#WS725e431141e7ba651172e0811eb8e35012-8000"
  }
};


//  Kevin 2013-07-19 >
//  Store the AE version to avoid CS5 bugs
var appVersion = parseFloat(app.version.split('x'));
//  < Kevin 2013-07-19

ux.rwAccess = check_readwriteAccess() ? true : false;

if(!ux.rwAccess){
  alert(ux.messages.rwAccess);

  //  Kevin 2013-07-19 >
  //  Give those bastards a last chance to tick the checkbox:
  app.executeCommand(2359);

  //  Check if they did
  if(!check_readwriteAccess())
  {
  //  They didn't ... I'm out of here
    return;
  }
  //  < Kevin 2013-07-19
}


var script_file = File($.fileName); // get the location of the scriptfile
var script_file_path = Folder.temp.path; //script_file.path; // get the path
var verison_history = [
 "**Current Version 0.2.2** fixed icons bug and CC 2018 ready",
 "* 0.2.1 CC 2015 ready",
 "* 0.2 ShapeLayer groups anchors are at paths position. Thanks 2 Kevin Schires!",
 "* 0.1.6 safer coding. Check for read write access. roving keys default is disabled now",
 "* 0.1.5 fixed capital M character path direction",
 "* 0.1.4 separation settings and help plus license agreement",
 "* 0.1.3 added motion paths",
 "* 0.1.2 added layer splitting",
 "* 0.1.1 minor fixes and enhancements",
 "* 0.1 initial version"
];
/**
 * Check if license already was accepted
 * and save it
 */
var res = null;
var script_version = v;
var website = "http://fabiantheblind.github.com/hershey-monoline-text";
var issue_tracker = "https://github.com/fabiantheblind/hershey-monoline-text-issues";
var settingsSectionName = "hershey-monoline-text-" + v;
if((app.settings.haveSetting(settingsSectionName,"licaccept") === true)){
var licres = parseInt(app.settings.getSetting(settingsSectionName,"licaccept"), 10);
if (licres==1){
    res = [true,true];
} else {
    res = licenseDiag("Monoline Text v" + script_version,website);
    }
}else{
  res = licenseDiag("Monoline Text v" + script_version,website);
}
if (!res[1]){
    return;
}if(res[0]){
    app.settings.saveSetting(settingsSectionName,"licaccept",1);
}

// get the rovingkeys warning settings
//
if(app.settings.haveSetting(settingsSectionName,'rovkeywarning') === true){
    var rovwarn = app.settings.getSetting(settingsSectionName,'rovkeywarning');
    ux.norovkeywwarning = (rovwarn.toLowerCase() == 'true') ? true : false;
}


/*
the icons in binary form
splitted into single variables for better handling.
Use Export to Bytes 2.jsx (thats slick)

http://aescripts.com/export-to-bytes/

or do it like this (this is me understanding whats going on)

https://raw.github.com/fabiantheblind/debugging-ae-scripts/master/batch_convert_to_binary.jsx

*/
  //  _____ _____ ____  _   _  _____
  // |_   _/ ____/ __ \| \ | |/ ____|
  //   | || |   | |  | |  \| | (___
  //   | || |   | |  | | . ` |\___ \
  //  _| || |___| |__| | |\  |____) |
  // |_____\_____\____/|_| \_|_____/

var icon_shape = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x01}IDATx\u00DA\u00ED\u0093\u00B1j\u00C2P\x14\u0086}\u0080>@\x07\u00C1\u00C5\x07pt,\u00B8es\u00EF\u00E2R\u00BA\x14\n\u00D5\u00AD4\u0083\u009BK\u00C0\u00B5C\x05\u00BB\u0084.\u0082\x0FP\u00B0\x0F \u00A4\u00C1%\u0083S2U\u00AE1\x06%\u00A2\u00B7\u00F7\u0083\x06.]\x02!\u0095\x0E9\u00F0\u00C3\u00E5\u009C\u00FF\u00CF\u00C79\u0090JYe\u00FD\u00AB\x1A\f\x06M\u00A5%\u00E2}N\u00F0\u00BD\x10\"F\u00BC\u00CF\u00C1\u00BCh\u00B7\u00DB\u0096\u00E7y;]\u009DN\u00E7\u0085\u00D9_A\x1B\u00C3\u00E1\u00F0s\u00B3\u00D9\u00C8\u00F5z\u009D8\u008E3G\u00BC\u00E91\u00C3S\x14\u00AC\u00CE\u00C7Z\u00AD\u00D6\u00C3l6\x13\x00V\u00ABUdY\u00D6\u00B3\u00EA\u00DF \u00DE\u00F4\u0098\u00E1\u00C1K\u0086ln\u00AA\u00FA\u00D0\u0094\u008F\x05Ap\b\u00C3\u00F0\u00E8\u00BA\u00AEc\x18\u00C6#@]\u00F4\u0098\u00E1\u00C1K\u0086ln\u00B0\u00DA\u00E2}<\x1E\u00CF\u00D9\u00C6\u00B6\u00ED\u00B7j\u00B5z\u00A7\x03u1\u00C3\u0083\u0097\f\u00D9\u00DC\u00E08\u008E\u00A7Q\x14\x1D\u0084\x10\u00A7\x14\u0090%\u00BCd\u00C8\u00E6\x06K)\u00EB\u00DB\u00ED\u00F6\u00E3\x07\u00DC\u00CD\u0082\u00E2\u00C1K\u0086l\x1E\u00A6\u00BE\u00F5-\u00E7\u00EB\u00F5z\u00AFY`<x\u00C9\u00E4\u00E5\u00E9[_r\u00BA\u00C9d\u00E2e\u0081\u00F1\u00E0%S)\u00A28\u009D\u00EF\u00FB\u00C7\u008Csw\u00F1\u00E0\u00D5\u00B3\u0085\u009C\u00DB4M\u00B7V\u00AB=\u00FD\u0086\u00D2cV\u00D4\u0099\u00F5\u00DF\u00EAJ\u009Dp\u0087F\u00A3Q\u00D8\u00EF\u00F7\u00BFt\u00D1K\u00E7x\x0B\x05/\x16\u008B\x18\u00A9SFj+\u00A1\u008B^:/\x14\u00BC\u00DF\u00EF\u009BJK\u0094$\u00C9\u00B5\u0094\u00B2\u00A1\u008B^:\u00C7[)\u00AB,U\u00DF\u00E0z\u00A3\x04\b\u00F8`\u00E7\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_mask = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00\u00D2IDATx\u00DA\u00ED\u0095A\n\u00C3 \x10E{\u0094B.\u00E2\x11r\u008A\u00AE\u00BB\u00ED)\u00C4\x13\u00F4\x04\u00E2\u00A2\x07\u00C8M\ft-\x14\u0094\u00AE\u00ED\u00FC\u0092\u0081\u0081@+\f\u00C1\u008D\x03\x0F\x12ux\u00CC\u00C4\u00E8i\u00C4\u0088\u00AE\u0091s>\x13\x0B1\x13\x06\u0094R*\u00E0\u00F7mn\u00C1\u00DA#\u00C4\u0096x\x11U\u0088\x01\u00C6\u00AC\x10\u00EB\u0085`{\u00B6)\u00A5\u00B7\u00F7\u00FE1M\u00D3\u0095\u0086.\x00\u00CF\u00CE\u00B9;\u00E6\u00B0F\u00E6i\u00C4\u0081+\u008D1>\u0085p\x07\u00E6\u00B0FT\x1E4\u00E2\u0099+\u0095\u00D2_r\u00AE\x1C\u00B9\x1A\u00B1!V\u00B4\u00F7\u009F\u0094A\u00DB\u00B7on\u00B4\u00E2*\u00ABm\u00A9\x1A9*1\u00EF\u00DCV)\u00C3y\u00DD\u00C4\u00EAV\x1Bcn\u008AVw\u00D8\\\u00BD~\u00A7\u00BE\x07H\u00FF#S\x7FI\u00AC\u00C7^\x12{qh\u00B8\x16\u00C3W<b\x04\u00C5\x07\u00DF\x19\u00D7xD\u00E2\x0B\u0085\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_path = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00\u00D0IDATx\u00DA\u00ED\u0094\u00C1\t\u00C4 \x14D-\u00C0\x12R\u00C0\u00DE\u00BDl\x11)\u00C0cz\u00D9\u009B\u00C5Y\u0086\x05\x18\x0F\u00E2\n\u00EE\x0E\u00AC a\u0091|>J\x0E\x19\x18\u0088~f\u00DE\u00E5\x1Bq\u00EB\u00F2RJ\u00AD\u00F0t\u00A8\u00B5v\u0087\u00F1=\x15\u00EA\u00BD/\u00F0\x14\u00B81fi\u00A1-\x1C\u00B3a\u00E0R\u008A\u00FCz\u0083+\u00B4\u009E1\x133T\u00C1\u00C3\x00Z\u00EB\x17\x15\u008C\f\x1B\u00EA\u009C{S\u00C1\u00C8 \u00CB\u0082\u00FE\u00CA\u00B7\u00A3q\u00DF\u009BU8u{\u009F\x15\u00CA1:\u00D0u\x1A\u009CRz\u0084\x10v.\x18\x1D\u00E8\x12\x14\u00E5\u009CW\x04\u00EB\u00939\x1A\u00F7\u00BD\x19\u00B2\u00E8h*\u00E9p\u00EAr\u00B1\u00A0-\u009C\nFf\u00FC\x0Fd\u0092d\u00E79\u00C9a\u00D4\x18\u00E3\u00F2o\u00DBq\u0087\x19\u00A3\u009A\u00B6\u00ED\u008C\u00ED\u00E5\u00C1\x19P\x1E\x1C\x16\u00B7N\u00EA\x03\n\u00AC\u00E0\b\u00D6\u00CA\u00DCk\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_left = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00\u00A6IDATx\u00DA\u00ED\u00D4\u00B1\r\u00C3 \x10\x05P\x06\u00C8H e\x14\u00D3\u00A5t\u00E7\u0092\u00D4,\u0090\u00D2\u00A5\u0087Ha\u0089E\\\u00B0\x01\b\tAA\u00CE\x03\u0084#\x12'\x17\u00E1K\u00AF<}\u00E9\u008A\u00CFFF\u00FE2\x1CL\x157\u0092Vk\u00ED\u00DB9W\u00BE1\u00C6p\u0092b\u00EF}\u00B58\u0084@S\\J\u00E1`\u00AA\u00A0y\u00B5\u00D6z\x03G+\u00A5\u00D4\u00ABK1\u00BCs\x07\u00E5\x07{\u0097\u00E2\u0094\u00D2\x02\u00D6V9\u00E7G\u0097b)\u00E5\x02V\u008C\x10\u00E2\u00CE\u0090P\u00BD\u00FA\u00D9\u00B58\u00C6\u00B8\u0081\u00A3\u00C1L\u00BF\\8N\u00B0\\\u00B8\u00F3\u0086`\u00B9p\u00E7\r\u00CDr\u00E18\x1B\x19\u00B9*\x1F\u0088\u008F\u00E45\u0093A\u00C2\u00EC\x00\x00\x00\x00IEND\u00AEB`\u0082";
var icon_right = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00\u00AAIDATx\u00DA\u00ED\u00941\n\x03!\x10E=\u00C0\x1EI!G\u00D1.e\u00BA\u0094\u00A6\u00F6\x02)\u00B7\u00CC!R,x\u0091-\u00BC\u00C1\u0088 Z\x18\x17\u00D2fXa\u00864>x\u00F5\u0083a\u00F8b2\u0099|Y\u00BA\x1AQ\u00B2T\u00BD\u00F7\x12\x00\u00DA/C\bo\u0096pJ\t\r\u00C7\x18y\u00C2\u00AD\u00B5\u00A5\u00AB\x11iNm\u00AD}:\u00E7\u00F6\x01_$a\x00\u00D8\u00BAm\u00C0\u008D$\\k\u00BD\u0096R\u00D6\x01\u00EF\u0082\x12\u00A5\u00D4\u00C5\x18\u00B3\u009E\u00906\f\x00\x0F\u00A6S\u00E3\u00E4\u009Co\u00DD\u00FD\u0084$\u00CF%\u0091\u0085\u00E2[\u00AEc\u0085\u0090\u0093\u00F2-W\u008C\x11\t3.\u00D7\u00B1B]=\u00A8\x14\u0093\u00C9\u00BF\u00F8\x00\u00AA\u0092\u00E45g\u0089\u00EC=\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_center = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00\u00A5IDATx\u00DA\u00ED\u00D4\u00B1\r\u00C4 \f\x05P\u0086a\f\u0086\u00C8\b\u00B0A\u00BA4W\u00A4f\u0089\u0094\x19\u00E2\u008A\fB\u0091\u0082\r\u00A0A4\u00BE\u00CF\x02gY\u00B1t\u00C5\u00F1\u00A5\u00D7a}\u00C9B633\x7F\x1D\x0B\u009EaA7)\u00A5W)\u0085\u00BE\x19o\u00D4\u008Bk\u00ADl1\u00DE\u00E8\x17\x13\u0091\x05\u00CF\u00D0[u\u008C\u00F1\u0084[\u00E8|\\\u008C\x15^@B\u00D7\u00E3\u00E2\u00DE\u00FB\x06\u0087\u00D0f\u00B4\x12BX\u00E0`,F;X\u00DF\x0E\u00C4\u00D8\u00D5\u008B[k+\u00DC\u008CU\u00B3\u00D3\u0081\x17r\u00F0,9\u00E7\u00B7\u00F4W\u008F\x19\u008D\u008B%.\x1E3\x1A\x17\u00CB\u0081\x17rff\u00E6W\u00F9\x00Q&\u00F0h\u00CD\u00EA\u00BBJ\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_split_dont = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00JIDATx\u00DA\u00ED\u00CD\u00C1\r\x00 \bCQ\x07c\x18&f\x18\u00E0\u008E\u00B0B\u00F5`b\u009B\u00FC#\u00BC\u00C5}?\u00E9\x14L`\u00D5\u00CC\u00C2\u00DD\x0Binax\x1E\u009CD\u00980a\u00C2\u0084\t\u00DF\u008733Ptna\u00B8\u00AA\u00A4S0Y\u00DC\x0B\u00DB\u00A39\x0F\u0081=\x13Wl\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_split_line = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00|IDATx\u00DA\u00ED\u0091\u00B1\r\u00C0 \f\x04\x19\u008C%\u00D8\x00V\u00A1\u00A4a\x046\u0082\x11\u00D8\u0081P (\x1C<@\u00A4\u00E8\u00D3 \u00C5']\u00F9\u00BE\u00C2J\u00F8=zkA5\\\u00CD9_\u00AD5B\u00E4-\x1C\u00E6\x03_\u0094\u00F0k\u00C6\x18e[A\x0B\x1C6\u00C6D\u00E7\\B\u00E4\u00AD\u00FCX\u00C2\u008F\u00AC\u00B5\u00E2\u009C3!\u00F2\x16\x0E{\u00EFK\b\u00A1\"\u00F2V~|~\u00B8\u00F7~\u00A1Q\u00DE\u00C2a\"\u00D2[\x0B\u00AA\u0095p\x027\x11\u0087\u00D2X\x7F\u00F4Z\u00AC\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_split_char = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x00\u00E8IDATx\u00DA\u00ED\u0092\u00B1\t\u0084@\x10E-\u00C0\x02,`\x03\u008BX\u00C1\x16\u00EC@;\u00B0\x00\x0314\u00B1\x04{\u00B1\x00-\u00C0\u00C0\x1E\\\x05Q\u00C1\u009B\x0F\n\u00C3\u00C0\u00C1\u00B1\u0091p\u00FB\u00E1%o\u0098\u00FD\u00C1\u008E\u00E7\u00F2\u00F7\u00D1D\u00CAP\u0084/\x1C\u0080S\u00C2i\u00EB\u00D6\u00BE\u00EF\u00CD<\u00CF\u00D7\u00C38\u008EE\u00D7u\u009A;\x00\u0087\x19w\u00D8\u00B5.\x16\x05\u00A0$b\u00E9oWJ\u00EF\u008A\x7F\u00CE\u00B6m\x0311\u00F2}\u00DFC\u00EE\u00C0\u00EDr\u00E1\x07\u00EB\u00E2$I\u009A,\u00CB\u00DA\u0087(\u008Ab\u00D2\x01w\x00\x0E3\u00EE\u00B0\u00EB\u00FE\u00D8\x15\x7F\u00CDq\x1C\r]l\u00FBp\u009Eg|]W\u00C0\x1D\u0080\u00C3\u008C;\u00ECZ\x17WU5\u00D4u=1r\u00BA\u00D8\u0090;p\u00BB\u009C;\u00EC\u00BA?~\x7F\u00F1\u00B2,\u0086?d\u008C)\u00D6u\u00D5\u00B2\x00\x0E3\u00EE\u00B0k]L\u00D7\u00AA\u0089\u0094\u00A1\b_8\x00\u00A7\u0084\u00D3\u009E\u00CB\x1B\u00F2\x01\u00F2\u00E0\u00A4\u0088`\u00BEr\u0082\x00\x00\x00\x00IEND\u00AEB`\u0082";

var icon_cogwheel = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x01aIDATx\u00DA\u00ED\u0093\u00B1j\u0083P\x14\u0086}\u0080<@\x1E \x0F\u00D1!{\x02\u009D\u0084B\u0097\x0Ey\u0080\u00E8\u0094!B\u00A0\u0098\u00A1\u0083K\x1C]\u009D\x1D\"\x04\u00BA\x06]#f\u00CC\u00A0\u008F \x0E\x1AE\u008D`\u00EF\x0F\x06\u00CCm\u00A9T\u00EF\u00D0\u00C1\x1F\x0E\x1E\u00CE\u00F9\u008F\u009F\x1E\u00EE\u00E5\x06\r\u00FA/\u009A\u0092\x18!\u0091$\u00E9\u00B8\u00DDn\u00CF\u00C8Q\u00AB{\u00EC\u00A5(\u00CA\u008B\u00EB\u00BA\u00B1,\u00CB\x07\u009E\u00E7wQ\x14U\b\u00E4\u00A8\u00A1G>f\u00C1\x1C\u00EC8\u00CE+@\u00BF\u0085\u00EF\u00FB+f\u00C0%\u0091(\u008A{\u00D34\u00BD60<\u00D8\x00fz\u0083\u00B1B\n\u00D0\x1A\u0098\u00E9\r\u00BE^\u00AF\u009F\u00F4\u008B\u00D34\u00BD\u0094e\u00F9~\u00BB\u00DDv\u00C8\u00E9>f\u00FAr'\u0082 |P\u00D0SUU\u00E3\u00BB\x019jM\x0FfH\x0B\u009En\u00F2<o\u00F3\u00C3\u00DF\u00CEi_\x18\u00863\u00DAg\u00DB\u00F6\u00BA38I\u00925\u00FDBM\u00D3f\u00B4O\u00D7\u00F59\u00ED\u008B\u00E3x\u00D3\x19\u008C5\x12\u00F8\u00C3\u00AA\r\u00C38Qk\x1C\u00A3\u00D6\u00F4`\u0086\u00CCN\u00B8>RU\u00F5\u00DB\u00E1\"\x7Fx\u00C1\u00B5A \u00A7\u00FB\u0098aq\u00AA\u00FF|\u009D0\u00D3\x1B\\\x14\u00C5[}m\u00BC6 <y\u009E\u00EFI,9V\u00B2,k\u00D5\x06\x0E\u0082\u00E0\u0099c\u00AD,\u00CB\x16X!y\x1E\u00B0\u0081;\f9ju\u00EF\u0089\x15\u008F>\u00E5S\x12\u00A3\u00FAC\u00CE$\u008E\u00C8QC\u008F\x1B4\u00A8\u00A1/\u00FE\u00F0o]2\u0089\x16b\x00\x00\x00\x00IEND\u00AEB`\u0082";

  var icon_info = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1E\x00\x00\x00\x19\b\x06\x00\x00\x00&5\u009E\x1A\x00\x00\x01\x1CIDATx\u00DA\u00EDT;\n\u0083@\x14\u00F4\x009L\x0E\u00E0%\u0084\x1C#E\u00FA\x14jkcg\u00B0\u00CA\x11R\u00E4\x066i\u00C4^,,\u00B4K\x11p]\u00FC\x15f\x07\x14\u0096e\r\u00C1U\u0092\u00C2\u0081\u00D78\u00F3ftV\u00D56l\u00F8\x17\u00E8\u0086a\u00B8\u008E\u00E3\u00A4\u00FC\u00E0\x1A\u00B85\x02w0\u008F\u00A2\u0088\x14E\u00D1\u00CB\x06\x1C4\u00D0.\x16j\u00DB\u00F6\x1D\u00E6\u00DF\f\u00B4\u008B\u00A4\u00B2*O\u00B2\x00BHG)}\u00C9\u00B8#\u0083\u00F2\u00D3N\u00D5\u009B\u00E7\u00F9-\fC}\u00AAv\u00EC\u00AA<\u00ED\u00E1\u00D3\u0099\u00FA\u00BE\u009FM\u00F1\u00D8\u009D\x1D\u00CC\f,\u0099iUU\u008F\u00B6m\u00AF\u0098\x0F\u00E7m\u00A9\x04\u00BB2S\u00D34/\u008C\u00DEC\u00B3r\u00B0\u00DCx\u00CD`\u00EB'\u00C1u]K_.J\u00E9\u0093q\u00A7A\u0093\u00E2\u00D3\x125\u00D8\u009D\x1D\u00DC\u00F7\u00FD\u00AE,K\"\u009Az\u009Ew\u00C6\x19\u008F\x13\u00C7q\u00C6\u00F3\u00D8\u00C1\u00AE\u00A6\u0082\u00A6i\u008Ebp\u0092$U\x10\x04\u00AFqD\x1E;\u00BC\u0087J\u00E5_\u00FF2\u00A1\x15\u00F7\u0095*\u00EF\u00BA\u00CE\x15k\x17\u00EB\u0085F^\u00B1\u00FA\r\u00E80\u00C7\x0B\u00C5\u00CF\x10\u00A8k\x1B6px\x03d\u00E9\u00E3d2q\u00D9)\x00\x00\x00\x00IEND\u00AEB`\u0082";

// This is the Master settings
//     ____  ____       _ ______ _____ _______
//    / __ \|  _ \     | |  ____/ ____|__   __|
//   | |  | | |_) |    | | |__ | |       | |
//   | |  | |  _ < _   | |  __|| |       | |
//   | |__| | |_) | |__| | |___| |____   | |
//    \____/|____/ \____/|______\_____|  |_|

var hershey = {
    "script_file" :script_file, // get the location of the    scriptfile
    "script_file_path" : script_file_path, // get the path
    "version" : '0.0.2',
    "intial_fontsize" : 42,
    "use_shapes":true,
    "use_mask":false,
    'settingsSectionName':settingsSectionName,
    /*

    this was a cool idea by Klaus Brandenburg
    Unfortunatly AE can't set the values of the paintbrush
    via scripting. Maybe there will be another way...

     */
    "use_paint":false,
    /*
    This is not yet implemented
    but on its way. fitting the layer to the lenght of the text so we can
    have a nice layer wherethe masks fit
     */
    "fit_layer":false,
    "use_path":false,
    "roving_keys":false,
    "use_null":false,
    "layer_in_comp_size":true, /* this is still in dev*/
    "solid_color":[1,1,1],
    /**
     * This sould replace the use_shapes boolean
     * But right now it is not needed.
     * Also I like the ternary operators :)
     * 0 = mask
     * 1 = shape
     * 2 = paint
     * 3 = path
     */
    "path_type":0,
    /* 0 is left aligned 1 is centered 2 is right aligned */
    "alignment":0,
    /*   0 = dont split | 1 = per line | 2 per character  */
    "split":0,
    /* this is in the order it is stored in the simplex font
    the newline characters are for better display  */
    "character_set" : " !\"#$%&\'()*+,-./0123456789:;<=>?@\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n[\\]^_`\nabcdefghijklmnopqrstuvwxyz\n{|}~",
    /*
    This is the simplex font
    One Edit I did is reversing some paths on the M
    If you encounter any other caracter that have wired directions
    let me know.
    to get the charCode of a character use this:

    alert("M".charCodeAt (0)) >> 77

    found here http://stackoverflow.com/questions/94037/convert-character-to-ascii-code-in-javascript

      */
    "simplex" : [{"ascii":32,"spacing":[0,16],"points":[]},{"ascii":33,"spacing":[8,10],"points":[[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},{"ascii":34,"spacing":[5,16],"points":[[4,21],[4,14],[-1,-1],[12,21],[12,14]]},{"ascii":35,"spacing":[11,21],"points":[[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]]},{"ascii":36,"spacing":[26,20],"points":[[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},{"ascii":37,"spacing":[31,24],"points":[[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]]},{"ascii":38,"spacing":[34,26],"points":[[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]]},{"ascii":39,"spacing":[7,10],"points":[[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]]},{"ascii":40,"spacing":[10,14],"points":[[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]]},{"ascii":41,"spacing":[10,14],"points":[[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]]},{"ascii":42,"spacing":[8,16],"points":[[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]]},{"ascii":43,"spacing":[5,26],"points":[[13,18],[13,0],[-1,-1],[4,9],[22,9]]},{"ascii":44,"spacing":[8,10],"points":[[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},{"ascii":45,"spacing":[2,26],"points":[[4,9],[22,9]]},{"ascii":46,"spacing":[5,10],"points":[[5,2],[4,1],[5,0],[6,1],[5,2]]},{"ascii":47,"spacing":[2,22],"points":[[20,25],[2,-7]]},{"ascii":48,"spacing":[17,20],"points":[[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]]},{"ascii":49,"spacing":[4,20],"points":[[6,17],[8,18],[11,21],[11,0]]},{"ascii":50,"spacing":[14,20],"points":[[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]]},{"ascii":51,"spacing":[15,20],"points":[[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},{"ascii":52,"spacing":[6,20],"points":[[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]]},{"ascii":53,"spacing":[17,20],"points":[[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]]},{"ascii":54,"spacing":[23,20],"points":[[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]]},{"ascii":55,"spacing":[5,20],"points":[[17,21],[7,0],[-1,-1],[3,21],[17,21]]},{"ascii":56,"spacing":[29,20],"points":[[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]]},{"ascii":57,"spacing":[23,20],"points":[[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]]},{"ascii":58,"spacing":[11,10],"points":[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]]},{"ascii":59,"spacing":[14,10],"points":[[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]]},{"ascii":60,"spacing":[3,24],"points":[[20,18],[4,9],[20,0]]},{"ascii":61,"spacing":[5,26],"points":[[4,12],[22,12],[-1,-1],[4,6],[22,6]]},{"ascii":62,"spacing":[3,24],"points":[[4,18],[20,9],[4,0]]},{"ascii":63,"spacing":[20,18],"points":[[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]]},{"ascii":64,"spacing":[55,27],"points":[[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]]},{"ascii":65,"spacing":[8,18],"points":[[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]]},{"ascii":66,"spacing":[23,21],"points":[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]]},{"ascii":67,"spacing":[18,21],"points":[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]]},{"ascii":68,"spacing":[15,21],"points":[[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]]},{"ascii":69,"spacing":[11,19],"points":[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]]},{"ascii":70,"spacing":[8,18],"points":[[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]]},{"ascii":71,"spacing":[22,21],"points":[[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]]},{"ascii":72,"spacing":[8,22],"points":[[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]]},{"ascii":73,"spacing":[2,8],"points":[[4,21],[4,0]]},{"ascii":74,"spacing":[10,16],"points":[[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]]},{"ascii":75,"spacing":[8,21],"points":[[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]]},{"ascii":76,"spacing":[5,17],"points":[[4,21],[4,0],[-1,-1],[4,0],[16,0]]},{"ascii":77,"spacing":[11,24],"points":[[4,0],[4,21],[-1,-1],[4,21],[12,0],[-1,-1],[12,0],[20,21],[-1,-1],[20,21],[20,0]]},{"ascii":78,"spacing":[8,22],"points":[[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]]},{"ascii":79,"spacing":[21,22],"points":[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]]},{"ascii":80,"spacing":[13,21],"points":[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]]},{"ascii":81,"spacing":[24,22],"points":[[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]]},{"ascii":82,"spacing":[16,21],"points":[[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]]},{"ascii":83,"spacing":[20,20],"points":[[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]]},{"ascii":84,"spacing":[5,16],"points":[[8,21],[8,0],[-1,-1],[1,21],[15,21]]},{"ascii":85,"spacing":[10,22],"points":[[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]]},{"ascii":86,"spacing":[5,18],"points":[[1,21],[9,0],[-1,-1],[17,21],[9,0]]},{"ascii":87,"spacing":[11,24],"points":[[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]]},{"ascii":88,"spacing":[5,20],"points":[[3,21],[17,0],[-1,-1],[17,21],[3,0]]},{"ascii":89,"spacing":[6,18],"points":[[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]]},{"ascii":90,"spacing":[8,20],"points":[[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]]},{"ascii":91,"spacing":[11,14],"points":[[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]]},{"ascii":92,"spacing":[2,14],"points":[[0,21],[14,-3]]},{"ascii":93,"spacing":[11,14],"points":[[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]]},{"ascii":94,"spacing":[10,16],"points":[[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]]},{"ascii":95,"spacing":[2,16],"points":[[0,-2],[16,-2]]},{"ascii":96,"spacing":[7,10],"points":[[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]]},{"ascii":97,"spacing":[17,19],"points":[[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},{"ascii":98,"spacing":[17,19],"points":[[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},{"ascii":99,"spacing":[14,18],"points":[[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},{"ascii":100,"spacing":[17,19],"points":[[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},{"ascii":101,"spacing":[17,18],"points":[[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},{"ascii":102,"spacing":[8,12],"points":[[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]]},{"ascii":103,"spacing":[22,19],"points":[[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},{"ascii":104,"spacing":[10,19],"points":[[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},{"ascii":105,"spacing":[8,8],"points":[[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]]},{"ascii":106,"spacing":[11,10],"points":[[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]]},{"ascii":107,"spacing":[8,17],"points":[[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]]},{"ascii":108,"spacing":[2,8],"points":[[4,21],[4,0]]},{"ascii":109,"spacing":[18,30],"points":[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]]},{"ascii":110,"spacing":[10,19],"points":[[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]]},{"ascii":111,"spacing":[17,19],"points":[[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]]},{"ascii":112,"spacing":[17,19],"points":[[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]]},{"ascii":113,"spacing":[17,19],"points":[[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]]},{"ascii":114,"spacing":[8,13],"points":[[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]]},{"ascii":115,"spacing":[17,17],"points":[[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]]},{"ascii":116,"spacing":[8,12],"points":[[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]]},{"ascii":117,"spacing":[10,19],"points":[[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]]},{"ascii":118,"spacing":[5,16],"points":[[2,14],[8,0],[-1,-1],[14,14],[8,0]]},{"ascii":119,"spacing":[11,22],"points":[[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]]},{"ascii":120,"spacing":[5,17],"points":[[3,14],[14,0],[-1,-1],[14,14],[3,0]]},{"ascii":121,"spacing":[9,16],"points":[[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]]},{"ascii":122,"spacing":[8,17],"points":[[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]]},{"ascii":123,"spacing":[39,14],"points":[[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]]},{"ascii":124,"spacing":[2,8],"points":[[4,25],[4,-7]]},{"ascii":125,"spacing":[39,14],"points":[[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]]},{"ascii":126,"spacing":[23,24],"points":[[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]]}],

    "images_binary":[icon_shape, icon_mask, icon_path, icon_left, icon_center, icon_right, icon_split_dont, icon_split_line, icon_split_char,icon_cogwheel,icon_info],

    "helptips":{
        "iconbutton_use_masks":"Select this and I will use masks for your text",
        "iconbutton_use_shapes":"Select this and I will use shapes for your text",
        "iconbutton_use_paint":"Select this and I will use the paint effect for your text",
        "iconbutton_use_path":"Select this and I will create a motion path from your text",
        "iconbutton_left":"This will align your text to the left",
        "iconbutton_center":"This will align your text to the middle",
        "iconbutton_right":"This will align your text to the right",
        "pointsize_etext":"Define the pointsize of your text",
        "abc_bttn":"If you press this the textfield will be filled with all the available characters in the simplex font",
        "help_bttn":"This opens the quickhelp.",
        "split_dont_bttn":"Select this and I will create a single layer for your text",
        "split_lines_bttn":"Select this and I will create a layer per line of your text",
        "split_chars_bttn":"Select this and I will create a layer for each character of your text",
        "settings_bttn":"Press this button to open the settings. e.g. roving keyframes or solid color",
        "write_bttn":"Press this and I will write your text to the selected comp"
    }

};
    ///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW
    var win = buildUI(thisObj);
    if((win !== null) && (win instanceof Window)) {
      win.center();
      win.show();
    } // end if win  null and not a instance of window


/**
 * [buildUI description]
 * @param  {[type]} thisObj [description]
 * @return {[type]}         [description]
 */
    function buildUI(thisObj) {

        var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;

      var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'monoline-text', [0, 0, W*9 + 10*G, H*7+G*4], {
        resizeable: true
      });

      if(win !== null) {

/**
 * Lets retrieve some saved settings
 */

// get the rovingkeys settings for quicker usage
if(app.settings.haveSetting(hershey.settingsSectionName,'roving_keys') === true){
    var rovkeys = app.settings.getSetting(hershey.settingsSectionName,'roving_keys');
    hershey.roving_keys = (rovkeys.toLowerCase() == 'true') ? true : false;

}
// get red
if(app.settings.haveSetting(hershey.settingsSectionName,'solid_red') === true){
    hershey.solid_color[0] = parseTextToFloat(app.settings.getSetting(hershey.settingsSectionName,'solid_red'), hershey.solid_color[0]);


}
// get green
if(app.settings.haveSetting(hershey.settingsSectionName,'solid_green') === true){
    hershey.solid_color[1] = parseTextToFloat(app.settings.getSetting(hershey.settingsSectionName,'solid_green'),hershey.solid_color[1]);

}
//get blue
if(app.settings.haveSetting(hershey.settingsSectionName,'solid_blue') === true){
    hershey.solid_color[2] = parseTextToFloat(app.settings.getSetting(hershey.settingsSectionName,'solid_blue'), hershey.solid_color[2]);


}

//store the data in a variable.
// 0 = center
// 1 = center active
// 2 = left
// 3 = left active
// 4 = right
// 5 = right active
//
        var iconfiles = [];
        for(var i=0; i < hershey.images_binary.length; i++) {
            iconfiles[i] = new File(hershey.script_file_path + "/xxxiconfilesxxx"+i+ ".png");
            iconfiles[i].encoding = "BINARY";
            iconfiles[i].open( "w" );
            iconfiles[i].write( hershey.images_binary[i] );
            iconfiles[i].close();
        }
        win.iconbutton_use_shapes = win.add('iconbutton',[x,y,x+W*1,y+H*1],iconfiles[0],{style: "toolbutton", toggle: true});
        win.iconbutton_use_shapes.value = hershey.use_shapes;
        x+=W*1+G;
        win.iconbutton_use_masks = win.add('iconbutton',[x,y,x+W*1,y+H*1],iconfiles[1],{style: "toolbutton", toggle: true});
        win.iconbutton_use_masks.value = hershey.use_mask;
        x+=W*1+G;

        win.iconbutton_use_path = win.add('iconbutton',[x,y,x+W*1,y+H*1],iconfiles[2],{style: "toolbutton", toggle: true});
        win.iconbutton_use_path.value = hershey.use_path;
        x+=W*1+G;
        win.iconbutton_left = win.add('iconbutton',[x,y,x+W*1,y+H*1],iconfiles[3],{style: "toolbutton", toggle: true});
        win.iconbutton_left.value = true;
        x+=W*1+G;
        win.iconbutton_center = win.add('iconbutton',[x,y,x+W*1,y+H*1],iconfiles[4],{style: "toolbutton", toggle: true});
        win.iconbutton_center.value = false;
        x+=W*1+G;
        win.iconbutton_right = win.add('iconbutton',[x,y,x+W*1,y+H*1],iconfiles[5],{style: "toolbutton", toggle: true});
        win.iconbutton_right.value = false;
        x+=W*1+G;
        win.split_dont_bttn = win.add('iconbutton',[x,y,x+W*1,y+H],iconfiles[6],{style: "toolbutton", toggle: true});
        win.split_dont_bttn.value = true;
        x+=W*1+G;
        win.split_lines_bttn = win.add('iconbutton',[x,y,x+W*1,y+H],iconfiles[7],{style: "toolbutton", toggle: true});
        win.split_lines_bttn.value = false;
        x+=W*1+G;
        win.split_chars_bttn = win.add('iconbutton',[x,y,x+W*1,y+H],iconfiles[8],{style: "toolbutton", toggle: true});
        win.split_chars_bttn.value = false;

        x=G;
        y+=(H+G);
        win.textfield_etext = win.add('edittext',[x,y,x+W*9 + 8*G,y+H*5],hershey.character_set,{multiline:true});
        y+=((H*5)+G);
        x=G;
        win.pointsize_etext = win.add('edittext',[x,y,x+W*1,y+H],String(hershey.intial_fontsize));
         x+=W*1+G;
        win.abc_bttn = win.add('button',[x,y,x+W*1,y+H],'abc');
        x+=W*1+G;
        win.settings_bttn = win.add('iconbutton',[x,y,x+W*1,y+H],iconfiles[9]);
        x+=W*1+G;
        win.help_bttn = win.add('iconbutton',[x,y,x+W*1,y+H],iconfiles[10]);
        x+=W*1+G;
        win.write_bttn = win.add('button',[x,y,x+W*5 + 4*G,y+H],'Write');

        //HELPTIPS by rollover
        win.iconbutton_use_shapes.helpTip = hershey.helptips.iconbutton_use_shapes;
        win.iconbutton_use_masks.helpTip = hershey.helptips.iconbutton_use_masks;
        win.iconbutton_use_path.helpTip = hershey.helptips.iconbutton_use_path;
        win.iconbutton_left.helpTip = hershey.helptips.iconbutton_left;
        win.iconbutton_center.helpTip = hershey.helptips.iconbutton_center;
        win.iconbutton_right.helpTip = hershey.helptips.iconbutton_right;
        win.pointsize_etext.helpTip = hershey.helptips.pointsize_etext;
        win.abc_bttn.helpTip = hershey.helptips.abc_bttn;
        win.help_bttn.helpTip = hershey.helptips.help_bttn;
        win.split_dont_bttn.helpTip = hershey.helptips.split_dont_bttn;
        win.split_lines_bttn.helpTip = hershey.helptips.split_lines_bttn;
        win.split_chars_bttn.helpTip = hershey.helptips.split_chars_bttn;
        win.settings_bttn.helpTip = hershey.helptips.settings_bttn;
        win.write_bttn.helpTip = hershey.helptips.write_bttn;

        win.iconbutton_use_shapes.onClick = function (){
            hershey.use_shapes = this.value;
            if(this.value === true){
                hershey.use_mask = false;
                win.iconbutton_use_masks.value = false;
            }
            if((this.value ===false)&&(hershey.use_mask===false)){
                this.value = true;
                hershey.use_shapes = this.value;
            }
        };
        win.iconbutton_use_masks.onClick = function (){
            hershey.use_mask = this.value;
            if(this.value === true){
                hershey.use_shapes = false;
                win.iconbutton_use_shapes.value = false;
            }
            if((this.value ===false)&&(hershey.use_shapes===false)){
                this.value = true;
                hershey.use_mask = this.value;
            }
        };

        win.iconbutton_use_path.onClick = function  () {
        //   if(ux.norovkeywwarning === false){
        //   if((this.value === true)&&(ux.aboutRovKeys === false)){
        //     alert(ux.messages.rovKey);
        //     ux.aboutRovKeys = true;
        //   }
        // }
            hershey.use_path = this.value;
        };

        win.abc_bttn.onClick = function  () {
        // var str= '';
        //     for(var i = 32; i <= 126;i++){
        //         str+= String.fromCharCode(i);
            // }
            win.textfield_etext.text = hershey.character_set;
        };

        win.textfield_etext.onEnterKey = function (k) {
            win.textfield_etext.textselection = '\n';
            win.textfield_etext.active = true;
        };
        win.help_bttn.onClick = function(){
            help_panel('Monoline Text.jsx v' + script_version + ' Help');
        };
        win.settings_bttn.onClick = function(){
            settings_panel('Monoline Text.jsx v' + script_version + ' Settings');
        };
        win.iconbutton_left.onClick = function  () {
            // this.value = true;
            hershey.alignment = 0;
            win.iconbutton_center.value = false;
            win.iconbutton_right.value = false;
            if((this.value === false)&&(win.iconbutton_center.value === false)&&(win.iconbutton_right.value === false)){
                this.value = true;
            hershey.alignment = 0;
            }
        };
        win.iconbutton_center.onClick = function  () {
            // this.value = true;
            hershey.alignment = 1;
            win.iconbutton_left.value = false;
            win.iconbutton_right.value = false;
            if((this.value === false)&&(win.iconbutton_center.value === false)&&(win.iconbutton_left.value === false)){
                this.value = true;
            hershey.alignment = 1;

            }

        };
        win.iconbutton_right.onClick = function  () {
            // this.value = true;
            hershey.alignment = 2;
            win.iconbutton_center.value = false;
            win.iconbutton_left.value = false;
            if((this.value === false)&&(win.iconbutton_center.value === false)&&(win.iconbutton_left.value === false)){
                this.value = true;
            hershey.alignment = 2;

            }

        };

        win.split_dont_bttn.onClick = function  () {
            hershey.split = 0;
            win.split_chars_bttn.value = false;
            win.split_lines_bttn.value = false;
            if((this.value === false)&&(win.split_chars_bttn.value === false)&&(win.split_lines_bttn.value === false)){
                this.value = true;
                hershey.split = 0;
            }
        };
        win.split_lines_bttn.onClick = function  () {
            hershey.split = 1;
            win.split_chars_bttn.value = false;
            win.split_dont_bttn.value = false;
            if((this.value === false)&&(win.split_chars_bttn.value === false)&&(win.split_dont_bttn.value === false)){
                this.value = true;
                hershey.split = 1;
            }
        };
        win.split_chars_bttn.onClick = function  () {
            hershey.split = 2;
            win.split_dont_bttn.value = false;
            win.split_lines_bttn.value = false;
            if((this.value === false)&&(win.split_lines_bttn.value === false)&&(win.split_dont_bttn.value === false)){
                this.value = true;
                hershey.split = 2;
            }
        };

        win.write_bttn.onClick = function(){
            var ptsize = Number (win.pointsize_etext.text);
            var text = win.textfield_etext.text;
           if (text !== null && text !== ''){

        var curComp = app.project.activeItem;
        if (!curComp || !(curComp instanceof CompItem)){
        alert('Please select a composition');
        return;
        }
        // var pos1 =  [curComp.width/2,(curComp.height/2)];
        // var pos2 = [0,0];
        var position = [0,0];
         if(hershey.alignment === 0 ){
            position = [0,0];
        }else if(hershey.alignment === 1){
            position =  [curComp.width/2,(0)];

        }else if (hershey.alignment === 2){
            position =  [curComp.width,0];
        }
        //
        drawString (text, ptsize,position, curComp);
        }
        };
        for(var j=0; j< hershey.images_binary.length; j++) {
            iconfiles[j].remove();
            }
      }


    return win;
  } // end build ui

function settings_panel(title){

// seperate these out to save and change them only on ok
var rovkeys = hershey.roving_keys;
var rovkeywarning = ux.norovkeywwarning;
var red = hershey.solid_color[0];
var green = hershey.solid_color[1];
var blue = hershey.solid_color[2];


var diag                     = new Window ('dialog',title + ''); // the new window
    diag.preferredSize       =    {'width':250,'height':130};
    diag.supergroup                 = diag.add('group',undefined,'');
    diag.supergroup.orientation     ='column';
//*-----------------------------------------------------------------*//
// Roving keyframes
    diag.rowroving_warn = diag.supergroup.add('group');
    // diag.rowroving_warn.minimumSize =  {'width':230,'height':10};
    diag.rowroving_warn.orientation = 'row';
    diag.rowroving_warn.alignment = 'left';
    diag.rowroving_warn.static_txt = diag.rowroving_warn.add('statictext',undefined,'Make sure your work area is big enough to have many keyframes. There will be a keyframe for every vertex in your text.\nIt "could" crash your AE if there is not enough space.',{'multiline':true});
     diag.rowroving_warn.static_txt.minimumSize = {'width':300,'height':10};
    diag.rowroving = diag.supergroup.add('group');
    diag.rowroving.orientation = 'row';
    diag.rowroving.alignment = 'left';
    diag.rowroving.static_txt = diag.rowroving.add('statictext',undefined,'Use roving keys for Motion Paths?');
    diag.rowroving.use_roving_check = diag.rowroving.add('checkbox',undefined,'');
    diag.rowroving.use_roving_check.value = hershey.roving_keys;

    // diag.rowroving_warn.dontwarnagain_check = diag.rowroving_warn.add('checkbox',undefined,'');
    // diag.rowroving_warn.dontwarnagain_check.value = ux.norovkeywwarning;
//*-----------------------------------------------------------------*//
// solid color
    diag.rowcolor = diag.supergroup.add('group');
    diag.rowcolor.orientation = 'row';
    diag.rowcolor.alignment = 'left';
    diag.rowcolor.headline_static_txt = diag.rowcolor.add('statictext',undefined,'Define the color for solids');
    diag.rowcolor.r_static_txt = diag.rowcolor.add('statictext',undefined,'R:');
    diag.rowcolor.r_edit_txt = diag.rowcolor.add('edittext',undefined,String(red));
    diag.rowcolor.r_edit_txt.minimumSize  = [30,5];
    diag.rowcolor.g_static_txt = diag.rowcolor.add('statictext',undefined,'G:');
    diag.rowcolor.g_edit_txt = diag.rowcolor.add('edittext',undefined,String(green));
    diag.rowcolor.g_edit_txt.minimumSize  = [30,5];
    diag.rowcolor.b_static_txt = diag.rowcolor.add('statictext',undefined,'B:');
    diag.rowcolor.b_edit_txt = diag.rowcolor.add('edittext',undefined,String(blue));
    diag.rowcolor.b_edit_txt.minimumSize  = [30,5];

    /* ----------------------------------------------- */
    diag.rowconfirm            = diag.supergroup.add ('group');
    diag.rowconfirm.orientation = 'row';
    diag.rowconfirm.alignment   = 'right';
// ------------ the comfirm or cancel buttons ------------
    diag.rowconfirm.ok               = diag.rowconfirm.add ('button', undefined, 'OK');
    diag.rowconfirm.cancel           = diag.rowconfirm.add ('button', undefined, 'Cancel');

    diag.rowroving.use_roving_check.onClick = function(){
        rovkeys = this.value;
    };
    // diag.rowroving_warn.dontwarnagain_check.onClick = function(){
    //   rovkeywarning = this.value;
    // };
    diag.rowcolor.r_edit_txt.onChange = function () {
      red = parseTextToFloat(this.text,hershey.solid_color[0]);
    };
    diag.rowcolor.g_edit_txt.onChange = function () {
      green = parseTextToFloat(this.text,hershey.solid_color[1]);
    };
    diag.rowcolor.b_edit_txt.onChange = function () {
      blue = parseTextToFloat(this.text,hershey.solid_color[2]);
    };



   if (diag.show () == 1){
        hershey.roving_keys = rovkeys;
        hershey.solid_color = [red, green, blue];
        // ux.norovkeywwarning = rovkeywarning;
        app.settings.saveSetting(hershey.settingsSectionName,'solid_red', red.toString());
        app.settings.saveSetting(hershey.settingsSectionName,'solid_green', green.toString());
        app.settings.saveSetting(hershey.settingsSectionName,'solid_blue', blue.toString());
        app.settings.saveSetting(hershey.settingsSectionName,'roving_keys', rovkeys.toString());
        // app.settings.saveSetting(hershey.settingsSectionName,'norovkeywwarning', rovkeywarning.toString());

    return true;
  }else{
    return false;

  }
}
function parseTextToFloat(theText,resetVal){
  var val = Math.abs( parseFloat(theText, 10));
    val = resetValIfNAN(val,resetVal);
  return val;
}

function resetValIfNAN(val,resetVal){
    if(isNaN(val) === true){
    val = resetVal;
    // alert(theErrorMessage);
    }
  return val;
}

/**
 * This is the help.
 *
 */
function help_panel(title){
var helpText = [];
helpText.push('Monoline Text quick help. For further infos go to ' + website);
helpText.push('If you run into any bugs please report an issue @ '+ issue_tracker);
helpText.push('');
helpText.push('The order in here corresponds to the order on the UI from left to right and from top down.');
helpText.push('');
helpText.push('1. The Shape Button:');
helpText.push('If selected the script will use shape layers for your text');
helpText.push('');
helpText.push('2. The Mask Button:');
helpText.push('If selected the script will use mask on solid layers for your text');
helpText.push('');
helpText.push('3. The Motion Path Button:');
helpText.push('This button right now is additional to the mask or shape selection. If activated the script will also create a null object with a motion path. This works only in single layer mode (see below). here in the settings you can decide if the script should use roving keyframes.');
helpText.push('');
helpText.push('4. Left Aligned Button:');
helpText.push('If selected the text will be left aligned');
helpText.push('');
helpText.push('5. Center Aligned Button:');
helpText.push('If selected the text will be center aligned');
helpText.push('');
helpText.push('6. Right Aligned Button:');
helpText.push('If selected the text will be right aligned.');
helpText.push('');
helpText.push('7. The Pointsize Textfield:');
helpText.push('Here you can set the pointsize for your text. The default is 42');
helpText.push('');
helpText.push('8. The Settings and Help Button:');
helpText.push('Press it and it will open the settings and help panel');
helpText.push('');
helpText.push('9. The Textfield');
helpText.push('Here  you can enter the text you want to be written  in monoline');
helpText.push('');
helpText.push('10. The Single Layer Button:');
helpText.push('If selected the script will create your text on one single layer.');
helpText.push('');
helpText.push('11. The Split Per Line Button');
helpText.push('If selected the script will separate your text per line.');
helpText.push('');
helpText.push('12. The Split Per Character Button:');
helpText.push('If selected the script will create a layer for every character in your text. This can take a while if you have a long text.');
helpText.push('');
helpText.push('13. The abc Button:');
helpText.push('This button just resets the textfield to its original state so you can see all characters available at the moment.');
helpText.push('');
helpText.push('14. The Write Button:');
helpText.push('This will write your text into the selected comp.');
helpText.push('');
helpText.push('VERSION HISTORY:');
for(var hist = 0; hist < verison_history.length; hist++){
  helpText.push(verison_history[hist]);
}



var diag                     = new Window ('dialog',title + ''); // the new window
    diag.preferredSize       =    {'width':250,'height':130};
    diag.supergroup                 = diag.add('group',undefined,'');
    diag.supergroup.orientation     ='column';
    diag.rowhelptext = diag.supergroup.add('group');

    diag.rowhelptext.edittxt = diag.rowhelptext.add('edittext',undefined,helpText.join('\n'),{
                                        multiline:true,
                                        scrolling: true});
    diag.rowhelptext.edittxt.preferredSize = {'width':470,'height':400};

    /* ----------------------------------------------- */
    diag.rowconfirm            = diag.supergroup.add ('group');
    diag.rowconfirm.orientation = 'row';
    diag.rowconfirm.alignment   = 'right';
// ------------ the comfirm or cancel buttons ------------
    diag.rowconfirm.ok               = diag.rowconfirm.add ('button', undefined, 'OK');
    diag.rowconfirm.cancel           = diag.rowconfirm.add ('button', undefined, 'Cancel');
   if (diag.show () == 1){
    return true;
  }else{
    return false;

  }
}

/*

This is the license dialoge that shows up
on startup. If you dont tell him to go away

*/
/**
 * [licenseDiag description]
 * @param  {[type]} n       [description]
 * @param  {[type]} website [description]
 * @return {[type]}
 */
function licenseDiag (n, website) {
    var lic= "DONT USE SCRIPTS FROM UNTRUSETED SOURCES! ALWAYS DOWNLOAD THIS SCRIPT @ "+ website +"/\n\n"+
    "If you obtained this script from any other source then the above mentioned"+
"\nIT COULD INCLUDE MALICIOUS CODE!\nBy confirming this dialog you also accept the license agreement below\n"+
"\nLICENSES\n"+"Copyright (c)  2013 Fabian \"fabiantheblind\" Morón Zirfas\n"+
"Permission is hereby granted, free of charge*, to any person obtaining a copy of this "+
"software and associated documentation files (the \"Software\"), to deal in the Software "+
"without restriction, including without limitation the rights to use, copy, modify "+
"the Software, and to permit persons to whom the Software is furnished to do so, subject to the following "+
"conditions:\n"+
"The above copyright notice and this permission notice shall be included in all copies "+
"or substantial portions of the Software.\n"+
"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, "+
"INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A "+
"PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT "+
"HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF "+
"CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE "+
"OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n"+
"see also http://www.opensource.org/licenses/mit-license.php\n\n"+
"*if you want to donate something so I can buy cookies and beer\ndo it via aescripts.com\n";

var diag                = new Window ("dialog",n + " || readme and license agreement");
    diag.preferredSize  =    {"width":450,"height":450};
var pan                 = diag.add('group',undefined,'');
    pan.orientation     ='column';
var txt                 = pan.add('edittext',undefined,lic,{multiline:true,scrolling: false});
    txt.preferredSize   =    {"width":440,"height":430};
var btg                 =  pan.add ("group");
var cbg                 = btg.add ("group");
    cbg.alignment       = "left";
var cb                  = cbg.add ("checkbox", undefined, "don't warn me again");
    btg.orientation     = 'row';
    btg.alignment       = "right";
    btg.add ("button", undefined, "OK");
    btg.add ("button", undefined, "cancel");
if (diag.show () == 1){
    return [cb.value,true];
  }else{
    return [false, false];
  }
}
  //  ______ _   _ _____     ____  ______   _    _ _____
  // |  ____| \ | |  __ \   / __ \|  ____| | |  | |_   _|
  // | |__  |  \| | |  | | | |  | | |__    | |  | | | |
  // |  __| | . ` | |  | | | |  | |  __|   | |  | | | |
  // | |____| |\  | |__| | | |__| | |      | |__| |_| |_
  // |______|_| \_|_____/   \____/|_|       \____/|_____|



/**
 * This is the main function
 * @param  {String} text      The Text To draw
 * @param  {Number} pointSize The size of the Text
 * @param  {Array of 2 Numbers} position  This is in the upper left corner for now
 * @param  {[type]} curComp   [description]
 * @return {[type]}           [description]
 */
function drawString (text, pointSize, position, curComp){

    app.beginUndoGroup('Build Mono Line Text');
    disableCompRefresh(curComp); // thanks KS

  //  Kevin 2013-07-19 >
  //  Add try to make sure the undo group will be closed
  //  and that the proxy will be removed
  try
  {
  //  < Kevin 2013-07-19

    var lineCount = 0;
    var code = 10;
    var rx = 0;
    var ry = 0;
    var motion_path = [];
    var line_widths = calc_width_of_line(text, pointSize);
    if(hershey.alignment==1){    position[0]-= (line_widths[0]/2) * pointSize/29;}
    if(hershey.alignment==2){    position[0]-= (line_widths[0]) * pointSize/29;}
    var xpos = position[0];
    var ypos = (position[1]-21*pointSize/29);


    var firstCharOffset;



    // alert("Msg:\nThere are " + line_widths.length + " lines in the text\n"+
    //     "with the these values" + line_widths.toString()
    //     );
    var layer = null;
    var shapegroup = null;
    var lname = 'monoline';

    if(hershey.split == 2){lname = text[0] +' '+ lname;
    }else if(hershey.split == 1){lname+= ' row 1';
    }

/**
 * Here is some user interaction that could go wrong
 * - selecting LightLayer or CameraLayer
 * - selcting split when having a layer selected
 * - adding masks to a shape
 *
 */

// check for light layers and cameras
    if(curComp.selectedLayers[0] instanceof LightLayer || curComp.selectedLayers[0] instanceof CameraLayer){
        alert('Sorry, I cant add masks to neither camera nor light layers');
        enableCompRefresh(curComp); // thnks KS
        return;
    } // end if check light and cam

    /**
     * This breaks if the user has split selected but has also
     * a selected Layer. It does not work that way
     *
     */
    if(hershey.split !== 0 && curComp.selectedLayers.length > 0){
      var l_type = hershey.use_shapes ? 'shapes' : 'masks';
        alert('Sorry I cant add split '+ l_type +' onto a selected layer. Please shut of text splitting or let me create the layers');
        delete this.l_type;
        enableCompRefresh(curComp); // thnks KS
        return;
    }

if((hershey.split === 0) && (curComp.selectedLayers.length > 0)){
  if((hershey.use_shapes === true)&&(curComp.selectedLayers[0] instanceof AVLayer)){
    alert('Sorry I can\'t create Shapes on an AVLayer');
    enableCompRefresh(curComp); // thnks KS
    return;
  }
}


  /**
   * this warns if the user tries to create masks on a ShapeLayer
   *
   */
    if(hershey.split === 0){
      if(curComp.selectedLayers.length > 0){
        if((curComp.selectedLayers[0] instanceof ShapeLayer) && (hershey.use_shapes === false)){
          var masks_on_shape_layers = confirm('Are you sure you want to create masks on a ShapeLayer?', true, 'Masks on ShapeLayer?');
            if(masks_on_shape_layers === false){
              enableCompRefresh(curComp); // thnks KS
              return;
            }else{
              layer = curComp.selectedLayers[0];
            }
            delete this.masks_on_shape_layers;
        }else{
              layer = curComp.selectedLayers[0];
        }
      }else{
    layer = hershey.use_shapes ? add_shape_layer(curComp, lname,text) : add_solid_layer(curComp, lname, text, line_widths);

      }
    }
        if((hershey.split === 1)&&(lineCount===0)){
            // split per row
            layer = hershey.use_shapes ? add_shape_layer(curComp,"monoline row "+(lineCount +1),text) : add_solid_layer(curComp,"monoline row "+ (lineCount + 1),text, line_widths);
            // alert('created layer ' + layer.name);
        }


var progress_win = new Window ("palette");

var progress = progress_bar(progress_win, text.length, 'Mask/Shape Progress');


    for(var c = 0; c < text.length;c++){
    // while (c++ < text.length){
        code = text.charCodeAt(c);
        if(c == text.length -1 && code == 10){
            break;
        }
        var pathname = text[c] + ' Char ' + c + ' Row ' + (lineCount+1);
        var the_mask_color = [Math.random(),Math.random(),Math.random()];
        if (code == 10){
            // this is a newline character
            // reset the starting point after each line
            if(hershey.alignment==1){    position[0] = curComp.width/2 - (line_widths[lineCount+1]/2) * pointSize/29;}
            if(hershey.alignment==2){    position[0] = curComp.width - (line_widths[lineCount+1]) * pointSize/29;}
            xpos = position[0];
            ypos -= 1.25*pointSize; // don't know why ask jongware
            lineCount++;
        if(hershey.split === 1){
            // split per row
            layer = hershey.use_shapes ? add_shape_layer(curComp,"monoline row "+(lineCount +1),text) : add_solid_layer(curComp,"monoline row "+ (lineCount + 1),text, line_widths);
            // alert('created layer ' + layer.name);
        }
            continue;
        }
        if (code < 32){
            // characters smaller than 32 do not exist
            continue;
        }
        if (code > 126){
            // characters greater than 126 do not exist
            continue;
        }
        if(hershey.split===2 ){
           layer = hershey.use_shapes ? add_shape_layer(curComp, text[c] + ' monoline', text) : add_solid_layer(curComp, text[c] + ' monoline', text, line_widths);
        }
        code -= 32;// first character is ' ' is at array 0

        var path = [];
        var pathnum = 1;

        // loop the simplex json
        for (var i = 0; i < hershey.simplex[code].points.length; i++){

            rx =  hershey.simplex[code].points[i][0]; // this is x
            ry =  hershey.simplex[code].points[i][1]; // this is y

            if (rx == -1 && ry == -1){
                if (path.length > 1){
                    shapegroup = make_path(path,layer ,text[c] + ' Char ' + c , ' Row ' + (lineCount+1), ' Path ' +pathnum ,the_mask_color,shapegroup, [xpos-firstCharOffset, -ypos]);
                    pathnum++;
                } // path.length > 1
                path = [];
                // -1 -1 something like the up char from hershey
            } else if(rx != -1 && ry != -1){

                if ((firstCharOffset === undefined)){
                  firstCharOffset = rx*pointSize/29;
                }
                // this calc also needs to be examined
                // also by jongware
                var x = rx * pointSize/29;
                var y = -ry * pointSize / 29; // *-1 o fit the AE coordinates
        if (!hershey.use_shapes)
        {
          x += xpos-firstCharOffset;
          y -= ypos;
        }
                path.push([x,y]);
                motion_path.push([x,y]);
            } // close else path.length > 1
        } // close for i
        if (path.length > 1){

            shapegroup = make_path(path,layer,text[c] + ' Char ' + c , ' Row ' + (lineCount+1), ' Path ' + pathnum , the_mask_color,shapegroup, [xpos-firstCharOffset, -ypos]);
            pathnum++;
        }
        // this is our spacing. need to inspect what it does
        // would be hershey.simplex[code].spacing[1];
        // looks like the most right coordinate?
        // maybee place a point there to se whats going on
        xpos += hershey.simplex[code].spacing[1] * pointSize/29;
        shapegroup = null;


      progress.value = c+1;
    } // close c++ < text.le
    progress.parent.close();

// we need to add the stroke here so we can se it
// else e had to move it down
    if (hershey.use_shapes === true){
        if(layer instanceof ShapeLayer){
            var stroke = layer("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
            stroke.name = "stroke";
        }
    }
// alert(motion_path.toSource());
if(hershey.use_path === true){
    // jiiiihhhaaa made a bug to a feature ;)
    // please ask me how...
    var motionpath_null = make_motion_path(curComp, motion_path,text);
    motionpath_null.parent = layer;
}

  //  Kevin 2013-07-19 >
  //  catch for the try
  }
  catch (err){
    alert( err.name + " while running the script \"" +  file[file.length-1]+ "\" (" + err.line + "):\n" + err.message, "Script Error");
  }
  //  < Kevin 2013-07-19

enableCompRefresh(curComp); // thnks KS
app.endUndoGroup();

}

/**
 * [calc_width_of_line description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function calc_width_of_line (text) {
    var charCode;
    var fc_off = null;
    x_pos = 0;

    var lines = [];
    text+='\n';
    for(var charCount = 0; charCount < text.length;charCount++){
         charCode = text.charCodeAt(charCount);
      if (charCode == 10){
            // this is a newline character
            lines.push(x_pos);
            x_pos = 0;
            // y_pos -= 1.25*pointSize; // don't know why ask jongware
            continue;
        }
        if (charCode < 32){
            // characters smaller than 32 do not exist
            continue;
        }
        if (charCode > 126){
            // characters greater than 126 do not exist
            continue;
        }
        charCode -= 32;// first character is ' ' is at array 0
        x_pos += hershey.simplex[charCode].spacing[1];

    }
    return lines;
}
/**
 * @unused
 * [make_paint_layer unfortunatly the paint brushes are not scriptable]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function make_paint_layer (argument) {
}
/**
 * [make_motion_path description]
 * @param  {[type]} comp       [description]
 * @param  {[type]} pathpoints [description]
 * @return {[type]}            [description]
 */
function make_motion_path (comp, pathpoints, text) {
    var progress_win = new Window ("palette");
    var progress = progress_bar(progress_win, pathpoints.length, 'Motion Path Progress');
    var nullobj = comp.layers.addNull();
        nullobj.name = 'Monoline Motion Path';
        add_zorro_tag(nullobj,[nullobj.name,text]);
    var inpoint = comp.workAreaStart;
    var outpoint = inpoint + comp.workAreaDuration;
    var wa_len = outpoint - inpoint;
    var time_step = wa_len / pathpoints.length;
    for(var i = 0; i < pathpoints.length; i++){
        if(i === 0){
            nullobj.transform.position.setValueAtTime(inpoint, pathpoints[i]);
        }
        if(i == pathpoints.length - 1){
        // last position keyframe
            nullobj.transform.position.setValueAtTime(outpoint, pathpoints[i]);
        }
        if((i !==0 )&&(i != (pathpoints.length - 1))){
      // als the others. non temporal would be cool
            nullobj.transform.position.setValueAtTime(inpoint + (time_step * i), pathpoints[i]);
        }
    progress.value = i+1;
    }
    progress.parent.close();
    if(hershey.roving_keys===true){
    progress_win = new Window ("palette");
    progress = progress_bar(progress_win, nullobj.transform.position.numKeys, 'Make Roving Keys');
      for(var j = 1; j < nullobj.transform.position.numKeys; j++){
        nullobj.transform.position.setRovingAtKey(j, true);
      progress.value = j+1;
      }
      progress.parent.close();
    }
    return nullobj;
}
/**
 * Path creation. As always the basis is taken from
 * http://www.redefinery.com/ae/fundamentals/
 *
 * http://www.redefinery.com/ae/fundamentals/masks/
 * with some additions to fit my needs
 * Still... Thanks 2 Jeff Almasol aka redefinery
 *
 *
 *
 * this builds a path using ternary operators
 * I like it that why a lot. Pretty slick
 * http://stackoverflow.com/questions/1771786/question-mark-in-javascript
 *
 * @param  {Array of Arrays}            path        holds the coordinates for the path
 * @param  {AVLayer}                    layer       The layer to draw on
 * @param {String}                      rowname     This is to sort ot rows
 * @param  {String}                     pathname    The name of the path
 * @param  {Array of 3 Values 0 -1 }    maskcolor   The color of the masks always per Glyph
 * @param {ADBE Vectors Group}          shapegroup The group that contains the path
 * @return {ADBE Vectors Group}         for reuse.
 *
 * @todo Get the hang of the diffrent paths in a Character
 */
function make_path(path,layer,charname, rowname, pathname , maskcolor, shapegroup, offset){
  add_zorro_tag(layer,[charname, rowname, pathname + ' ' +charname]);
var masksGroup = null;
    masksGroup = hershey.use_shapes ? layer("ADBE Root Vectors Group") : layer("ADBE Mask Parade");
// Get
// PropertyGroup for the shape
// or
// the PropertyGroup for the masks
    // masksGroup = layer("ADBE Mask Parade");
if (masksGroup !== null){
    var mask = null;
// Create a new mask
if(shapegroup === null && hershey.use_shapes === true){
    var pregroup = masksGroup.addProperty("ADBE Vector Group");
    pregroup.name = charname + ' ' + rowname;

  //  Kevin 2013-07-19 >
  //  offset the character position
  pregroup.transform.position.setValue(offset);
  //  < Kevin 2013-07-19

    shapegroup = pregroup.addProperty("ADBE Vectors Group");
    mask = shapegroup;

}
    mask = hershey.use_shapes ? shapegroup.addProperty("ADBE Vector Shape - Group") : masksGroup.addProperty("ADBE Mask Atom");
        // mask = masksGroup.addProperty("ADBE Mask Atom");
        if (mask !== null){
            mask.name = hershey.use_shapes ? pathname : charname + ' ' + rowname + ' ' + pathname;
            mask.color = maskcolor;

      var barycentre = [0, 0];
      var numVertices = path.length;

            var s = new Shape();// new shape object
            if (s !== null){
                s.vertices = path;
                // The close attribute defaults to true
                s.closed = false;
                // put the path verticies into the shape or mask
                maskShape = hershey.use_shapes ? maskShape = mask.property("ADBE Vector Shape") : mask.property("ADBE Mask Shape");
                // Change the mask shape (not keyframed)
                maskShape.setValue(s);
            }
        }

    }
return shapegroup;
}

/**
 * [add_shape_layer description]
 * @param {[type]} comp  [description]
 * @param {[type]} lname [description]
 * @param {[type]} text  [description]
 */
function add_shape_layer (comp, lname, text) {

        var layer = comp.layers.addShape();
        layer.comment = '*'+text;
        layer.name = lname;
        add_zorro_tag(layer,[lname, text]);
        layer.duration = comp.duration;
        layer.anchorPoint.setValue([comp.width/2,comp.height/2]);
    return layer;
}
/**
 * [add_solid_layer description]
 * @param {[type]} comp  [description]
 * @param {[type]} lname [description]
 * @param {[type]} text  [description]
 */
function add_solid_layer (comp, lname, text, lines) {
    var max = 0;
    var l_width = comp.width;
    var l_height = comp.height;

    if(hershey.fit_layer===true){
        max = get_max(lines);
    }
    if(max > l_width){
        l_width = max;
    }

var layer  = comp.layers.addSolid(
    hershey.solid_color ,
      lname ,
     l_width ,
      l_height ,
      1,
      comp.duration);
// layer.comment = text;
// var infos = [lname, text];
add_zorro_tag(layer,[lname, text]);
return layer;
}

  //  _    _ _______ _____ _      _____ _______ _____ ______  _____
  // | |  | |__   __|_   _| |    |_   _|__   __|_   _|  ____|/ ____|
  // | |  | |  | |    | | | |      | |    | |    | | | |__  | (___
  // | |  | |  | |    | | | |      | |    | |    | | |  __|  \___ \
  // | |__| |  | |   _| |_| |____ _| |_   | |   _| |_| |____ ____) |
  //  \____/   |_|  |_____|______|_____|  |_|  |_____|______|_____/

/**
 * Get highest value of array
 * @param  {Array} arr
 * @return {Number}
 */
function get_max (arr) {
var max = Math.max.apply(null, arr);
return max;
}
/**
 * Taken from ScriptUI by Peter Kahrel
 *
 * @param  {Palette} w    the palette the progress is shown on
 * @param  {[type]} stop [description]
 * @return {[type]}      [description]
 */
function progress_bar (w, stop, labeltext) {
var txt = w.add('statictext',undefined,labeltext);
var pbar = w.add ("progressbar", undefined, 1, stop); pbar.preferredSize = [300,20];
w.show ();
return pbar;
}

function add_zorro_tag(layer, textarr){
// layer.comment
// str.substring(0, str.length - 1);
// alert(layer.name);
var cmt_str = '';
for(var i =0; i < textarr.length;i++){
    cmt_str+='*' + textarr[i] + ',';
  }
  cmt_str.substring(0, cmt_str.length -1);
  layer.comment+=cmt_str;
}

  //  ______ _    _ _   _  _____ _______ _____ ____  _   _  _____
  // |  ____| |  | | \ | |/ ____|__   __|_   _/ __ \| \ | |/ ____|
  // | |__  | |  | |  \| | |       | |    | || |  | |  \| | (___
  // |  __| | |  | | . ` | |       | |    | || |  | | . ` |\___ \
  // | |    | |__| | |\  | |____   | |   _| || |__| | |\  |____) |
  // |_|     \____/|_| \_|\_____|  |_|  |_____\____/|_| \_|_____/

  //  _  __ _____
  // | |/ // ____|
  // | ' /| (___
  // |  <  \___ \
  // | . \ ____) |
  // |_|\_\_____/


/**
 * This sets a proxy to build the result faster
 * Got this trick from Kevin Schires
 * @param  {CompItem} comp
 * @return {nothing}
 */
function disableCompRefresh(comp){
  //  Kevin 2013-07-19  >
  //  Don't do it in CS5 to avoid AE to crash
  if (appVersion != 10.0)
  {
    comp.setProxyWithSolid(comp.bgColor, comp.name, comp.width, comp.height, 1);
  }
  //  < Kevin 2013-07-19
}

/**
 * This resets so we can se what we did
 * @param  {CompItem} comp
 * @return {nothing}
 */
function enableCompRefresh(comp){
  //  Kevin 2013-07-19 >
  //  Don't do it in CS5 to avoid AE to crash
  if (appVersion != 10.0)
  {
    comp.setProxyToNone();
  }
  //  < Kevin 2013-07-19
}

} // end of run_monoline_text

  //  __  __ __  __
  // |  \/  |  \/  |
  // | \  / | \  / |
  // | |\/| | |\/| |
  // | |  | | |  | |
  // |_|  |_|_|  |_|

// taken from keyTweak.jsx thanks Mathias Möhl
// http://www.mamoworld.com/
// works on any localization
//~ alert(check_readwriteAccess());

function check_readwriteAccess(){
var securitySetting = app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY");
var result = (securitySetting == 1); // 0 is true 1 is false
  return result;
}

})(this);
