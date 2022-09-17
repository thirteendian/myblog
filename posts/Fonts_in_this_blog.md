---
title: Fonts in this blog
date: '2022-09-16' 
label: blog
---
<p class="intro">
Unfortunately that the trend of ligature was disappeared after early PC has been developed,
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
   off-ſet) [see Short S before and after F for details]
5. Short s is used before the letter b in books published during the 17th century and the first half of the 18th
   century (e.g. husband, Shaftsbury), but long s is used in books published during the second half of the 18th
   century (e.g. huſband, Shaftſbury) [see Short S before B and K for details]
6. Short s is used before the letter k in books published during the 17th century and the first half of the 18th
   century (e.g. skin, ask, risk, masked), but long s is used in books published during the second half of the 18th
   century (e.g. ſkin, aſk, riſk, maſked) [see Short S before B and K for details]
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
    finally [see Rules for Long S in some late 18th and early 19th century books for details]
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
2. Replace all end `ſ` to be `s` (Rule 1)
4. Replace all apostrophe `ſ` to be `s` (Rule 2)
5. Replace all `ffſ` and `fſ` to be `ffs` (Rule 4)
6. Replace all `ſf` to be `sf` (Rule 3)
7. Replace all `ſb` to be `sb` (Rule 5 early version)
8. Replace all `ſk` to be `sk` (Rule 6 early version)

David didn't do any replacement about s in front of hyphen (Rule 7), as well as when this hyphen is omit (Rule 8)

### David's Problematic Solution

However, we noticed that his replacement will cause special character such like `À` or `Ç` not be able to be used and
searched anymore. Actually, according to Tex
StackExchange [Question 290261](https://tex.stackexchange.com/questions/290261), if we want to modify this old font to
fit current Latex and CSS rules, the `.ttf` file need to be converted to `.otf`, the em size need to be adjusted, the
ligature configuration in `otf` file(especially in his italic version `wyldi.ttf`).

### Convert TTF to OTF

Before Generate new `otf` font in *FontForge*, a few adjustments are required.

Goto `Element`->`Font Info` -> `General`, adjust `Em Size` to be less than 1000 value. 
Then goto `Element`->`Font Info` -> `OS/2`, adjust `OS/2 Version` to be larger than 1 value(can be auto).
Finally, generate otf font by `File`->`Generate Fonts`, 
under new pop up window, 
choose `OpenType(CFF)`, 
while under suitable folder click `Generate`.

### Add Common Ligature
Each ligature requires a new Encoding Slots, 
do so by `Encoding`->`Add Encoding Slots` in FontForge.
Select newly created slot and right click choose `Glyph Info`->`Unicode`,
change the `Glyph Name`. 
It's standard to change the name to be the combination of letter of ligature, with underscore in between.
For example, if I want to create ligature of `ffi`, I may name it to be `f_f_i`.

A Ligature Substitution LookupTable must be created for otf to find suitable ligature replacement.
At `Element`->`Font Info`->`Lookups`, 
click `Add Lookup` on the right side,
and choose `Ligature Substitution` at `Type:`.
Then click the "little button" next to <New> to add a new line, 
triggered a drop-down list, and choose `liga Standard Ligatures`.
We can also type the value `liga` mentions above in `Feature` and it's basically the same thing,
similarly, if it's an historic ligature, choose `hlig Historic Ligatures`.
Finally, tickled `Store ligature data in AFM files`.


A Ligature Substitution SubTable must be added to the specific previously created LookupTable,
At At `Element`->`Font Info`->`Lookups`, 
Click one LookupTable, and click `Add Subtable` for it,
after naming the subtable at random name,
associate the `Source Glyph Names` on the right column of pop up window,
each source slot name should be separate by space.
This will help FontForge relates source slots and ligature slot in Composite step.

As mentioned above, at newly created encoding slot,
choose `Element`->`Build`->`Build Composite Glyph`,
this function only works while previous subtable is set correctly,
so FontForge will put source slots glyph into this new slot together.
Before start to edit this slot, for example, add ligature line,
we need to firstly Unlink Reference,
or every edition will reflect on source glyph as well.
Double click the slot entering the character view window,
click `Edit`->`Unlink Reference`.

At my project, since all ligature drawing has already been down,
we can simply copy it from the original incorrect position to the newly created encoding slot.
To test the result, one can use `Metrics`->`New Metrics Window` to type and test ligature.
