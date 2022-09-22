---
title: Font In This Blog. Font Ligature, Long S And FontForge
subtitle: The modifications of Caslon style font Wyld
date: '2022-09-16' 
label: blog
---

<p class="intro">
Unfortunately, the trend of ligature was disappeared after early PC has been developed,
because they tend to handle typefaces in the way of single character.
After TeX Program leaded a new trend of ligature, it indirectly caused the development of OpenType.
This blog is managed to use Wyld® font by David Manthey, designed to match the font used in "The Practical Surveyor",
which is open-source and belongs to series of <em>Caslon</em> font from 17th Century.
However, this TrueType font need to be firstly converted into new standard OpenType,
and of course plenty of re-encodings and adjustments are required. 
This article described my process of modifying the ligature font on this website.
</p>

## Four Types of Ligature in OpenType and CSS {#a1}

There are normally four types of ligature:
*common*, *discretionary*, *historical*, *contextual*. CSS by `font-variant-ligatures`.

The *common* ligatures referred to the most common ligatures including:
ff, fi, ffi, fl, ffl. OpenType values is `liga` and `clig`, CSS mode is `common-ligatures`.

The *discretionary* ligatures referred to the ligatures defined by designer, may include:  ct,st,sp,ae, oe. OpenType
values is `dlig`, CSS mode is `discretionary-ligatures`.

The *historical* ligatures referred to the ligatures used in old book, may include: long s, sh, si, sl, ss, tz(German).
OpenType values is `hlig`, CSS mode is `historical-ligatures`.

The *contextual* ligatures referred to the adjustment of single characters with surroundings. For example, in italic
font, "on", "ose" and many others may be adjusted to connect to each other. The contextual alternates should be designed
to properly connect. OpenType value is `calt`, CSS mode is `contextual` and default activated.

## Ligature Rules {#a2}

### Long and Short s {#a2-1}

According to Boston
1775's ["The Long List of Rules for the Long s"](https://boston1775.blogspot.com/2013/10/the-long-list-of-rules-for-long-s.html)
, the rules of Long S has been widely described
in [BabelStrone Blog's The Rules for Long S](https://www.babelstone.co.uk/Blog/2006/06/rules-for-long-s.html).

1. Short s is used at the end of a word (e.g. his, complains, ſucceſs)
2. Short s is used before an apostrophe (e.g. clos’d, us’d)
3. Short s is used before the letter f (e.g. ſatisfaction, misfortune, transfuſe, transfix, transfer, ſucceſsful)
4. Short s is used after the letter f (e.g. offset), although not if the word is hyphenated (e.g. off-ſet)
5. Short s is used before the letter b in books published during the 17th century and the first half of the 18th
   century (e.g. husband, Shaftsbury), but long s is used in books published during the second half of the 18th
   century (e.g. huſband, Shaftſbury)
6. Short s is used before the letter k in books published during the 17th century and the first half of the 18th
   century (e.g. skin, ask, risk, masked), but long s is used in books published during the second half of the 18th
   century (e.g. ſkin, aſk, riſk, maſked)
7. Short s is used before a hyphen in compound words with the first element ending in the letter s (e.g. croſs-piece,
   croſs-examination, Preſs-work, bird’s-neſt)
8. Compound words with the first element ending in double s and the second element beginning with s are normally and
   correctly written with a dividing hyphen (e.g. Croſs-ſtitch, Croſs-ſtaff), but very occasionally may be written as a
   single word, in which case the middle letter s is written short (e.g. Croſsſtitch, croſsſtaff).(thus when 3 `s`
   happened it should be `*ſs-ſ*` or `*ſsſ*`)
9. Long s is used initially and medially except for the exceptions noted above (e.g. ſong, uſe, preſs, ſubſtitute)
10. Long s is used before a hyphen at a line break (e.g. neceſ-ſary, pleaſ-ed), even when it would normally be a short
    s (e.g. Shaftſ-bury and huſ-band in a book where Shaftsbury and husband are normal), although exceptions do occur (
    e.g. Mans-field)
11. Double s is normally written as double long s medially and as long s followed by short s finally (e.g. poſſeſs,
    poſſeſſion), although in some late 18th and early 19th century books a different rule is applied, reflecting
    contemporary usage in handwriting, in which long s is used exclusively before short s medially and finally
12. Long s is maintained in abbreviations such as ſ. for ſubſtantive, and Geneſ. for Geneſis (this rule means that it is
    practically impossible to implement fully correct automatic contextual substitution of long s at the font level)

### R Rotunda and Rum Rounda {#a2-2}

R Rotunda/Rum Rounda (`Ꝛ` `ꝛ`),
in unicode "UniA75A" and "UniA75B", 
normally only used in "Blackletter" or "Gothic" style font, thus our roman typefaces won't consider to use it.
Referred to ["BabelStone's Blog Article about R Rotunda"](https://www.babelstone.co.uk/Blog/2006/07/r-rotunda-part-1.html),
since the R Rotunda is not a consistent rule, and various between different eras and fonts, 
we sum up the brief rules as followings:
1. R Rotunda is used after letter B, D, O, P, V, W, b, h, o, p, v, w.
2. R Rotunda is only used on bent d, not used on straight d
3. R rotunda "may" add on y
4. Apostrophe will not break R Rotunda.

## Wyld Font {#b1}

The font information can be checked
at ["18 Century Ligatures and Fonts"](https://www.orbitals.com/self/ligature/ligature.pdf). The zip folder provided
contains a `.dot` file with early ages embedded VBA Macro, and typically David Manthey's solution about replacing
ligature letter to be unusual letter.

### Extract the VBA Macro in dot file {#b1-1}

It is rare to find and VB sources and MS Office before 2003, I considered the tools to extract VBA directly from dot
file. Olevba is an open-source Python shell, and it can be
easily [Installed Using pip](https://github.com/decalage2/oletools/wiki/Install), thus it becomes an suitable tool in
this project. Here is the example of extractions:

```vba[class="line-numbers"]
Sub LigatureWyld()
'
' LigatureWyld Macro
' Convert all Wyld font text so that it has ligatures.
'
    Selection.Find.ClearFormatting
    Selection.Find.Font.Name = "Wyld"
    Selection.Find.Replacement.ClearFormatting
    With Selection.Find
        .Text = "ct"
        .Replacement.Text = "À"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = True
        .MatchWholeWord = False
        .MatchWildcards = False
        .MatchSoundsLike = False
        .MatchAllWordForms = False
    End With
    Selection.Find.Execute Replace:=wdReplaceAll
    With Selection.Find
        .Text = "s"
        .Replacement.Text = "Ç"
        .Forward = True
        .Wrap = wdFindContinue
        .Format = True
        .MatchCase = True
        .MatchWholeWord = False
        .MatchWildcards = False
        .MatchSoundsLike = False
        .MatchAllWordForms = False
    End With
    '...
    '(many lines are omitted)
End Sub 
```

David basically replace the inline ligature possible letter "ct" with unusual letter "À", designed in he's own way, the
following table showed all replacements he defined, from left to right, in order:

| `ct` | `s` | `Ç>` | `_s>` | `Ç’` | `ÁÇ` | `fÇ` | `Çf` | `Çk` | `Çb` | `ffi` | `ffl` | `ff` | `fi` | `fl` | `ÇÇ` | `Çh` | `Çi` | `Çl` | `Çt` |
|------|-----|------|-------|------|------|------|------|------|------|-------|-------|------|------|------|------|------|------|------|------|
| `À`  | `Ç` | `s`  | `_Ç`  | `s’` | `Ás` | `fs` | `sf` | `sk` | `sb` | `Â`   | `Ã`   | `Á`  | `Ä`  | `Å`  | `Ë`  | `È`  | `É`  | `Ê`  | `Ì`  |

> `Ç>` might means letter `Ç` at the end of word, and `_s>` means letter `s` at the beginning of word.

### David's Special Replacement {#b1-2}

Specific replacement happened to fit rules of Long and Short s:

1. All `s` firstly has been replaced as `ſ` (Then we only consider *when to put short s* in the Rule)
2. (Rule 1) Replace all end `ſ` to be `s`
3. (Rule 2)(Rule 3)(Rule 5 early version)(Rule 6 early version) Replace all `ſ` before apostrophe(`-`), `f`, `b`,`k`,`'`
   to be `s`
4. (Rule 4)Replace all `ffſ` and `fſ` to be `ffs`

David didn't do any replacement about s in front of hyphen (Rule 7), as well as when this hyphen is omit (Rule 8)

### David's Problematic Solution {#b1-3}

However, we noticed that his replacement will cause special character such like `À` or `Ç` not be able to be used and
searched anymore. Actually, according to Tex
StackExchange [Question 290261](https://tex.stackexchange.com/questions/290261), if we want to modify this old font to
fit current Latex and CSS rules, the `.ttf` file need to be converted to `.otf`, the em size need to be adjusted, the
ligature configuration in `otf` file(especially in his italic version `wyldi.ttf`).

## Modifications based on Wyld {#b2-1}

The followings are the process of my modification of original wyld, with new standard OTF script and conditional
ligature, I will name this font to be Yyld, for my future usage, and usage in this blog.

### Convert TTF to OTF {#b2-1}
Before Generating new `otf` font in *FontForge*, a few adjustments are required.

Goto `Element`->`Font Info` -> `General`, adjust `Em Size` to be less than 1000 value. Then goto `Element`->`Font Info`
-> `OS/2`, adjust `OS/2 Version` to be larger than 1 value(can be auto). Finally, generate otf font by `File`
->`Generate Fonts`, under new pop up window, choose `OpenType(CFF)`, while under suitable folder click `Generate`.

### Add Common Ligature {#b2-3}

The Ligature Substitution replace multiple glyph with one single glyph.

Each ligature requires a new Encoding Slots, do so by `Encoding`->`Add Encoding Slots` in FontForge. Select newly
created slot and right click choose `Glyph Info`->`Unicode`, change the `Glyph Name`. It's standard to change the name
to be the combination of letter of ligature, with underscore in between. For example, if I want to create ligature
of `ffi`, I may name it to be `f_f_i`.

A Ligature Substitution LookupTable must be created for otf to find suitable ligature replacement. At `Element`
->`Font Info`->`Lookups`, click `Add Lookup` on the right side, and choose `Ligature Substitution` at `Type:`. Then
click the "little button" next to <New> to add a new line, triggered a drop-down list, and
choose `liga Standard Ligatures`. We can also type the value `liga` mentions above in `Feature` and it's basically the
same thing, similarly, if it's an historic ligature, choose `hlig Historic Ligatures`. Finally,
tickled `Store ligature data in AFM files`.

A Ligature Substitution SubTable must be added to the specific previously created LookupTable, At At `Element`
->`Font Info`->`Lookups`, Click one LookupTable, and click `Add Subtable` for it, after naming the subtable at random
name, associate the `Source Glyph Names` on the right column of pop up window, each source slot name should be separate
by space. This will help FontForge relates source slots and ligature slot in Composite step.

As mentioned above, at newly created encoding slot, choose `Element`->`Build`->`Build Composite Glyph`, this function
only works while previous subtable is set correctly, so FontForge will put source slots glyph into this new slot
together during build process. Before start to edit this slot, for example, add ligature line, we need to firstly Unlink Reference, or every
edition will reflect on source glyph as well. Double click the slot entering the character view window, click `Edit`
->`Unlink Reference`.

For multiple editing, I strongly suggest creating all necessary new encoding slots first with correct renaming, then add subtable
under `Element`->`Font Info`->`Lookups`, with auto searching name, to avoid of clicking on each slot one by one. Finally, we can 
"Build" all components together, and adjust them one by one.

At my project, since all ligature drawing has already been down, we can simply copy it from the original incorrect
position to the newly created encoding slot. And give that "not-so-uncommon" symbol to it's original position.


Note: The Substitute SubTable's order is mattered if `ff` is matched, then it will jump to the next position. So it's
necessary to put `ffi/ffl` matching before `ff`

Now we added f and long s related ligatures, and they are under `liga` LookupTable.

### Add Long S Contextual Ligature {#b2-4}

Note that until now, only f related normal ligatures were working without any conditional cases, as described above.
In David's solution, he firstly converted all s to be ſ. However, we won't consider this reverse way, because that will
cause all s, even the single typed s (before or after nothing), to be longs as well, which does not follow the Rule of end short s(Rule 1).

This particular situation can referred to a sets of special symbols that unicode use to represent the End of Line/File. 
In unicode, there are three important End of line/End of file Return that are normally represent the end of the content.
The name ins font table are `Uni000A`(LF/Line Feed), `Uni000C`(FF/Form Feed) and `Uni000D`(CR/Carriage Return).
If we follow the David's strategy, we need to add an extra contextual substitution to support the situation when `s` is at the end, but no characters behind it. 
or you will notice an ugly long s will appeared at every section title. However, FortForge does not support the contextual substitution before
the above 3 special symbols.

Thus we will consider a new substitution strategy from the opposite directly, and fit current OTF standard:

1. Add SingleSubstitution Rules to bidirectional convert s and ſ.
2. Contextual 1-1, If s after everything(except f and ff ligature),  and before alphabets(except f,b,k, and includes ligature symbols), 
then convert to ſ.
3. Contextual 1-2, If s before alphabets(except f,b,k, ff related ligatures but includes all other ligature symbols),
then convert to ſ.
4. Contextual 2-1, If ſ after f(and ff ligature), and before everything,
then convert to s.
5. Contextual 2-2, If ſ before everything except alphabet(except f,b,k and f-related ligature symbols but includes all other ligature symbols)
then convert to s.

> The name 1-1 means "the first Contextual LookupTable"'s first SubTable. 
> We create 2 LookupTable here to represent rules of "s to ſ" and "ſ to s".
> We specifically create a SubTable to represent "Before" rules, 
> because s might be the "start of file/line", and nothing before or after it.
> This will solve the problem that contextual substitution does not support LF/FF/CR.

The FontForge supported three different substitution that are also defined in OpenType rules: `Glyph`,`Classes`
, `Coverage`.
`Glyph` is basically replace glyph with another glyph. `Classes` are more useful, replace one sets of glyphs(any
occurred) with another glyph. Here I will discuss the usage of `Classes` in my modification. The
FontForge `contextual substitution` will add condition on `single substitution`, so in our case, a Single Substitution
LookupTable SubTable must be created before add Contextual.

Firstly, following our step 1, create Single Substitution. A Single Substitution LookupTable should be created as followings:
`Element`-> `Font Info`-> `Lookups`->`Add Lookup`-> `Type: Single Substitution`->`OK`, here we will add no feature, thus
it won't reflect any changes.

Secondly, if any Ligature Substitution are needed during contextual, it should be created now, with no features added.

Finally, create Contextual Chain Substitution. Contextual Chain Substitution need special pattern grammar to match, the
grammer is described following:

```c
Backtracking_1 | Class_Name_2 @<SingleSubstitutionName>| Lookahead_3
/* ===========================Explanation===========================
 * IF Backtracking_1(char in backtracking glyphs class) 
 * follows by Class_Name_2(char in current glyphs class)
 * follows by Lookahead_3 (char in lookahead glyphs class),

 * THEN replace Class_Name_2 char 
 * with single substitution(defined in Single Substitution LookupTable) 
 * rule SingleSubstitutionName.
 */
```

"`Backtracking_1`", "`Class_Name_2`", "`Lookahead_3`" are classes defined in the bottom part,
`@<...>` are pre-defined other substitution tables/rules(single substitution, ligature substitution etc.).

For creating Contextual LookupTable:
`Element`-> `Font Info`-> `Lookups`->`Add Lookup`-> `Type: Contextual Chaining Substitution`->`Feature: calt`. On that
Contextual LookupTable, `Add Subtable`, with `By Classes` and `Complex`.  
The "Edit Chaining Substitution" dialogue has two part, top part for creating the script, bottom part for defining three
classes tag including `Match Classes`, `Back Classes`, `Ahead Classes`. Firstly, defining all necessary classes under
three tags, then click `<New>` on the top, this will pop up a new dialogue. Secondly, under new dialogue, under each
label, click corresponding Classes(maybe several same classes are needed) to set match pattern, this pattern will be put
into grammar at it's corresponding position between `|`. Under `Match Classes` there is an extra window "An ordered list
of lookups and positions", for adding pre-defined substitution rules (`@<>` in grammar) at the corresponding position.
For example, if `class_1 class_1 class_2` are selected at `Match`, and apply substitution rules `@<ligature_1>` at
position `2`, then `class_2` will use that rule, and generate grammar `...|class_1 class_1 class_2 @<ligature_1>`. After
all set, click `next` to automatically generate grammar script.

>Each Contextual Chain subTable must **only have one grammer expression**, we need to add a new subTable if
more expressions are required.

Since the order of LookupTables(and it's subTable) is crucial in GSUB table. The font will match in order, and
preferentially match the first rules and jump to the next position. For example, if `ss` is matched, it won't
match `ssf` at the same position.

At the end, we translate the 2,3,4,5 steps into real code:

The first subTable rule in `calt` s to ſ LookupTable is
```c
Back | s @<Single Substitution in Latin lookup 0> | Ahead
/* Back  class includes everything(except f and ff ligature)*/
/* Ahead class includes all small alphabets(except f,b,k) 
 * and all ligature symbols(except f-related ligatures) */
```
The second subTable rule in `calt` s to ſ LookupTable is
```c
| s @<Single Substitution in Latin lookup 0> | Ahead
/* Ahead class includes all small alphabets(except f,b,k) 
 * and all ligature symbols(except f-related ligatures) */
```

The third subTable rule in `calt` ſ to s LookupTable is
```c
Back | long_s @<Single Substitution in Latin lookup 0> | Ahead
/* Back  class includes two symbol f and ff ligature*/
/* Ahead class includes everything*/
```

The fourth subTable rule in `calt` s to ſ LookupTable is
```c
| long_s @<Single Substitution in Latin lookup 0> | Ahead
/* Ahead class includes everything, include f,b,k,f-related ligatures, but except all other small alphabics */
```

>Here we should pay attention that the 3th and 4th table's Ahead class is not the same,
> becase for 3rd, if ſ is after f/ff, no matter what after it, it would be converted back to small s.
> But the 4th one only discussed the rule when ſ is the first letter.
> In the future, if any new symbols are added, one should extend 3rd's Ahead class to include it,
> but one may not do anything to the 4th Ahead class.

At the end of the table, just as the previous f-related ligature,
I created the Ligature Substitution Table to make all `ſ` related
ligatures.
### Add Long S Contextual Ligature of Compound sss  {#b2-5}
I created a specific sss symbols with `ſſs` ligatured together.
This ligature is at the least rank, if s is not ligatured with any of others,
then this sss ligature is applied. This will make it possible to distinguish compound sss to fit (Rule 8).

A third `calt` LookupTable is appled behind the previous two,
with rules: If all three `ſ` is appeared together, then convert the last one to be `s`.
Also a third `liga` LookupTable is applied behind the previous ligature LookupTable,
to apply `ſſs` ligature with least priority.

### Adjust Italic Font  {#b2-50}

Beside of regular type, there're also a version of italic Wyld font provided as name `Wyldi.ttf`.
I applied the similar Ligature rules as previously designed. To generate the same font with different style name,
we need to change the font name to be the same, but different style name. Goto `Element`-> `Font Info`->`Unicode`,
change `Fontname` to be "Yyld-Regular" or "Yyld-Italic", correspondingly to the `Weight` regular and italic.
but maintain the `Family Name` to be the same.

### Test Without Exporting  {#b2-6}
To test the result, one can use `Metrics`->`New Metrics Window` to type and
test ligature.
### Clockwise and CounterClockwise  {#b2-7}
Some circle part should be white background but black filled, select the circle, `Element`->`Clockwise` will solve this problem.

### No Contextual Rule supported on iPhone {#b2-8}

Unfortunately, the contextual substitution on iPhone is not supported.

### Spacing and Kerning {#b2-9}
Several rules should be applied to make font looks better, for spacing, not always the same side bearing
means good-looking. In this font, we adjust all letter to be left closed to 0, 
thus the only modification will be "how they close to 0" and their right side bearing.

1. 'A' 'H' 'I' 'M' 'N' 'O' 'T' 'U' 'V' 'W' 'X' 'Y' 'o' 'v' 'w' 'x' should have symmetric side bearings(Not in our case,
it should say same right side feeling, followings are the same).
By clicking one slot, and under `Metrics`, there are few tools to adjust the width.
However, one cannot set all symmetric letter with same total width, for example "HH"'s spacing may look different than 
"OO"'s because of "Optical Illusion". One can check through all possible string using 
tools [String Maker by Nina Stössinger](http://www.ninastoessinger.com/stringmaker/index.php)
2. Adjust `o` and `n` together using string to make the best spacing(and height)
3. `o` with left `c`, `d`, `e`, and `q` for their left position.
4. `o` with right `b`, `p` for their right bearing.
5. `n` with right `h`,`m` for their right bearing
6. `n` with left `b`, `h`, `k`, `m`, `p`, `r` for their left position
7. Adjust all others using combination of above letters.

Apart from spacing, few combination of capital letter with small letter paris need to kerning,
or the edge of Capital letter will cause ugly large space between it and small letter. To 
adjust kerning, `Element`->`Font Info`->`Lookups`->`GPOS`->`Add Lookup`->`Type: Pair Position(Kerning`.
Add css feature `kern`. Then add subTables just as all previous works. We may choose `Use a matrix of kerning classes`
to adjust a set of slot pairs, all parameters may leave unchanged. Choose `T` and `o` relatively on top and bottom
window, after clicking `ok`, a new dialogue will pop up.

1. Start from the adjust-needed pair `WA`,`Wa`, `To` and `Av` from `Metrics`->`New Metrics Window` , It support dragging way of adjust all kerning together directly,
   after setting all adjustable pair, one may try to finally adjust individual one by one.
2. Adjust all others

### Final Grain {#b2-10}

More historical rules can be checked at ["The Printer's Grammar"](https://www.google.com/books/edition/The_Printer_s_Grammar/jjE5AAAAMAAJ?hl=en&gbpv=0)
written in 1787 by John Smith. However, we will combine the modern rule together in this font for better web display,
one of them maybe displayed at ["Design With FontForge"](http://designwithfontforge.com/en-US/Spacing_Metrics_and_Kerning.html).

Few other necessary ligatures are added : `ſj`,`ſſj`, `st`, `Th`, `cp`, `et`, `sp`, `Qu`.Also with arrow `->` and `<-`.

I also added the support for french accent marks for example:
1. la cédille: ç
2. l’accent aigu: é
3. l’accent circonflexe: â/ê/î/ô/û
4. l’accent grave: à/è/ì/ò/ù
5. le tréma: ë/ï/ü
>According to Babelstrone, 
> French and English typographic practice differs in one important respect : French (and also Spanish) typography uses a short s before the letter 'h', whereas English typography uses a long s.

The modified Font name is "Yyld-Regular.otf" and "Yyld-Italic.otf", 
both belongs to font family "Yyld". To support web load, we will generate woff files besides otf,
as "Yyld-Regular.woff" and "Yyld-Italich.woff".
and use it in this blog.

>When generate new Fonts out, we'd better not replace the original otf file, it may cause ligature not be able to
use. A new named file is recommended.

Here are the table tests for special ligatures in this font:

Common Ligature(liga): F related ligatures:

| `fi` | `fj` | `fl` | `ff` | `ffi` | `ffj` | `ffl` |
|------|------|------|------|-------|-------|-------|
| fi   | fj   | fl   | ff   | ffi   | ffj   | ffl   |
| *fi* | *fj* | *fl* | *ff* | *ffi* | *ffj* | *ffl* |


Contextual Ligature(calt) S related ligatures:

| `sh` | `si` | `sl` | `st` | `ss` | `ssf` | `ssb` | `ssk` | `ss-` | `ss'` | `fss` | `fssb` |
|------|------|------|------|------|-------|-------|-------|-------|-------|-------|--------|
| sh   | si   | sl   | st   | ss   | ssf   | ssb   | ssk   | ss-   | ss'   | fss   | fssb   |
| *sh* | *si* | *sl* | *st* | *ss* | *ssf* | *ssb* | *ssk* | *ss-* | *ss'* | *fss* | *fssb* |

Discretionary Ligatures(dlig):

| `ct` | `cp` | `fst` | `fsp` | `et` | `The` | `Qu` | 
|------|------|-------|-------|------|-------|------|
| ct   | cp   | fst   | fsp   | et   | The   | Qu   | 
| *ct* | *cp* | *fst* | *fsp* | *et* | *The* | *Qu* | 

Reassess the Rules:

| `Rule 1,9,11` | `Rule 2` | `Rule 3`     | `Rule 4` | `Rule 5,6,7` | `Rule 8`   |
|---------------|----------|--------------|----------|--------------|------------|
| his           | clos'd   | satisfaction | offset   | husband      | crossstaff |
| complains     | us'd     | successful   | off-set  | ask          |            | 
| success       |          | transfuse    |          | cross-piece  |            |