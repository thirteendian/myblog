---
title: Fonts in this blog 
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

## Four Types of Ligature

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

## Ligature Rules

### Long and Short s

According to Boston
1775's ["The Long List of Rules for the Long s"](https://boston1775.blogspot.com/2013/10/the-long-list-of-rules-for-long-s.html)
, the rules of Long S has been widely described
in [BabelStrone Blog's The Rules for Long S](https://www.babelstone.co.uk/Blog/2006/06/rules-for-long-s.html).

1. Short s is used at the end of a word (e.g. his, complains, ſucceſs)
2. Short s is used before an apostrophe (e.g. clos’d, us’d)
3. Short s is used before the letter f (e.g. ſatisfaction, misfortune, transfuſe, transfix, transfer, ſucceſsful)
4. Short s is used after the letter f (e.g. offset), although not if the word is hyphenated (e.g.
   off-ſet) 
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
    contemporary usage in handwriting, in which long s is used exclusively before short s medially and
    finally 
12. Long s is maintained in abbreviations such as ſ. for ſubſtantive, and Geneſ. for Geneſis (this rule means that it is
    practically impossible to implement fully correct automatic contextual substitution of long s at the font level)

## Wyld Font

The font information can be checked
at ["18 Century Ligatures and Fonts"](https://www.orbitals.com/self/ligature/ligature.pdf). The zip folder provided
contains a `.dot` file with early ages embedded VBA Macro, and typically David Manthey's solution about replacing
ligature letter to be unusual letter.

### Extract the VBA Macro in dot file

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

Note that `Ç>` means letter `Ç` at the end of word, and `_s>` means letter `s` at the beginning of word.

### David's Special Replacement

Specific replacement happened to fit rules of Long and Short s:

1. All `s` firstly has been replaced as `ſ` (Then we only consider *when to put short s* in the Rule)
2. (Rule 1) Replace all end `ſ` to be `s` 
3. (Rule 2)(Rule 3)(Rule 5 early version)(Rule 6 early version) Replace all `ſ` before apostrophe(`-`), `f`, `b`,`k`,`'` to be `s` 
4. (Rule 4)Replace all `ffſ` and `fſ` to be `ffs`

David didn't do any replacement about s in front of hyphen (Rule 7), as well as when this hyphen is omit (Rule 8)

### David's Problematic Solution

However, we noticed that his replacement will cause special character such like `À` or `Ç` not be able to be used and
searched anymore. Actually, according to Tex
StackExchange [Question 290261](https://tex.stackexchange.com/questions/290261), if we want to modify this old font to
fit current Latex and CSS rules, the `.ttf` file need to be converted to `.otf`, the em size need to be adjusted, the
ligature configuration in `otf` file(especially in his italic version `wyldi.ttf`).

## Modifications based on Wyld

The followings are the process of my modification of original wyld, with new standard OTF script and conditional
ligature, I will name this font to be Yyld, for my future usage, and usage in this blog.

### Convert TTF to OTF

Before Generating new `otf` font in *FontForge*, a few adjustments are required.

Goto `Element`->`Font Info` -> `General`, adjust `Em Size` to be less than 1000 value. Then goto `Element`->`Font Info`
-> `OS/2`, adjust `OS/2 Version` to be larger than 1 value(can be auto). Finally, generate otf font by `File`
->`Generate Fonts`, under new pop up window, choose `OpenType(CFF)`, while under suitable folder click `Generate`.

### Add Common Ligature

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
together. Before start to edit this slot, for example, add ligature line, we need to firstly Unlink Reference, or every
edition will reflect on source glyph as well. Double click the slot entering the character view window, click `Edit`
->`Unlink Reference`.

For multiple editing, I strongly suggest creating all necessary slots first with correct renaming, then add subtable
under `Element`->`Font Info`->`Lookups`, with auto searching name, to avoid click on each slot, and finally Build
components together.

At my project, since all ligature drawing has already been down, we can simply copy it from the original incorrect
position to the newly created encoding slot. To test the result, one can use `Metrics`->`New Metrics Window` to type and
test ligature.

Note: When generate new Fonts out, we'd better not replace the original otf file, it may cause ligature not be able to
use.

Note: The Substitute SubTable's order is mattered
if `ff` is matched, then it will jump to the next position. So it's necessary to put `ffi/ffl` matching before `ff`

Now we added f and long s related ligatures, and they are under `liga` LookupTable.

### Add Long S Contextual Ligature

Note that until now, only f related normal ligatures were working without any conditional cases, as described above,
we will firstly convert all s to be ſ, then follow the David's replacement strategy, at the following steps:

1. Convert all short s to be ſ.
2. Replace ſ to be s before all other characters except `f`,`b`,`k`,`-`,`'`
3. Replace ſ to be s after `f`
4. Apply `ſſ`, `ſi`, `ſl`,`ſt` ligature rules.
5. Apply `st` ligature rules. Special ligature `st` and `fs(ß)` should be created(which does not in original wyld font).
6. If `sss...` happened, we will specifically consider them as ſſs, with ſſ ligatured, thus no extra rules will need.

The FontForge supported three different substitution that are also defined in OpenType rules: `Glyph`,`Classes`, `Coverage`.
`Glyph` is basically replace glyph with another glyph. `Classes` are more useful, 
replace one sets of glyphs(any occurred) with another glyph. Here I will discuss the usage of `Classes` in my modification.
The FontForge `contextual substitution` will add condition on `single substitution`, so in our case,
a Single Substitution LookupTable SubTable must be created before add Contextual.

Firstly, create Single Substitution. A Single Substitution LookupTable should be created as followings:
`Element`-> `Font Info`-> `Lookups`->`Add Lookup`-> `Type: Single Substitution`->`OK`, here we will add no feature,
thus it won't reflect any changes.

Secondly, if any Ligature Substitution are needed during contextual, it should be created now, with no features added.

Finally, create Contextual Chain Substitution. Contextual Chain Substitution need special pattern grammar to match,
the grammer is described following:
```c
Backtracking_1 | Class_Name_2 @<SingleSubstitutionName>| Lookahead_3
/* ===========================Explanation===========================
/* IF Backtracking_1(char in backtracking glyphs class) 
/* follows by Class_Name_2(char in current glyphs class)
/* follows by Lookahead_3 (char in lookahead glyphs class),

/* THEN replace Class_Name_2 char 
/* with single substitution(defined in Single Substitution LookupTable) 
/* rule SingleSubstitutionName.
```
"`Backtracking_1`", "`Class_Name_2`", "`Lookahead_3`" are classes defined in the bottom part, 
`@<...>` are pre-defined other substitution tables/rules(single substitution, ligature substitution etc.).


For creating Contextual LookupTable, described as followings:
`Element`-> `Font Info`-> `Lookups`->`Add Lookup`-> `Type: Contextual Chaining Substitution`->`Feature: calt`.
On that Contextual LookupTable, `Add Subtable`, with `By Classes` and `Complex`.  
The "Edit Chaining Substitution" dialogue has two part, 
top part for creating the script, 
bottom part for defining three classes tag including `Match Classes`, `Back Classes`, `Ahead Classes`. 
Firstly, defining all necessary classes under three tags, then click `<New>` on the top, this will pop up a new dialogue.
Secondly, under new dialogue, under each label, click corresponding Classes(maybe several same classes are needed) to set match pattern,
this pattern will be put into grammar at it's corresponding position between `|`. 
Under `Match Classes` there is an extra window "An ordered list of lookups and positions",
for adding pre-defined substitution rules (`@<>` in grammar) at the corresponding position. 
For example, if `class_1 class_1 class_2` are selected at `Match`, and apply substitution rules `@<ligature_1>` at position `2`, 
then `class_2` will use that rule, and generate grammar `...|class_1 class_1 class_2 @<ligature_1>`. 
After all set, click `next` to automatically generate grammar script.


Note that **each Contextual Chain LookupTable must only have one grammer expression**, 
we need to add a new table if more expression is required.

The order of LookupTables(and it's subTable) is crucial in GSUB table. 
The font will match in order, and preferentially match the first rules and jump to the next position.
For example, if `ss` is matched, it won't match `ssf` at the same position.

Following David's replacement strategy, I put `ſ` at original s position, and build an extra encoding to represent `s`.
I added one Single Substitution Table for converting `ſ` back to `s`, and two Contextual Substitution Rules:
```java
//First rule to convert end long s back to short s
| short_s @<convert_back_to_short_s> | Except_all_Alphbeta_without_fbk-'|
//Second rule to convert long s after f back to short s
f_char | short_s @<convert_back_to_short_s> |
```
And following the other ligature rules. Since we have converted all necessary short s back,
we will only consider `s` related ligatures.

### Adding extra ligatures

Few other necessary ligatures are added : `ſj`,`ſſj`, `st`, `Th`, `cp`, `et`, `sp`, `Qu`, also with arrow `->` and `<-`.

fi fj fl ff 

ffi ffj ffl 

sh si sl ss st

ssf ssb ssk ss- ss'

ct fst The

fsp et 

successful clos'd offset off-set husband skin cross-piece cross-stitch possession

Question Quintessences Quadrumvirates

