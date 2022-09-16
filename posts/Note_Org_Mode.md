---
title: Note about Emacs Org-mode
date: '2022-09-05'
label: emacs
---

[//]: # (# Table of Contents)

[//]: # ()
[//]: # (1.  [Title]&#40;#org6b6bf22&#41;)

[//]: # (2.  [Rich Text]&#40;#org924b17d&#41;)

[//]: # (3.  [Code Block]&#40;#org83a4e74&#41;)

[//]: # (    1.  [Init Setup]&#40;#org8b43609&#41;)

[//]: # (    2.  [Block Input]&#40;#org252e4b1&#41;)

[//]: # (    3.  [Latex setup]&#40;#orga2f667c&#41;)

[//]: # (4.  [Export]&#40;#org6d79c98&#41;)

[//]: # (5.  [Draw Ditaa image]&#40;#orgc5ce1f0&#41;)



<a id="org6b6bf22"></a>

# Title {#id-title}

The first paragraph is not indented.
<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>

Like markdown, org-mode use one or more `*[space]` at the beginning of paragraph as tree of title.

Insert same level of title by key: `M-<RET>`

Fold or unfold cycle<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup> of title by press `<TAB>` on the title. Fold or unfold cycle of all title by `C-u <TAB>` or `<SHIFT> <TAB>`.

Next title `C-c C-n`;(next)

Next same level title `C-c C-f`;(front)

Previous title `C-c C-p`;(previous)

Previous save level title `C-c C-b`;(back)

Parent level `C-c C-u`;


<a id="org924b17d"></a>

# Rich Text {#id-RichText}

Like markdown '`**`' is for **bold**; '`/italic/`' is for *italic*; '`_underlined_`' is for <span class="underline">underline</span>; `=verbatim=` is for `verbatim`; `~code~` is for `code`; `+strikethrough+` is for <del>strikethrough</del>.

The footnote is marked as `[fn::<body>]` or seperate line `[fn:A1] [fn:A1]<body> [newline] [newline]`<sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup>;


<a id="org83a4e74"></a>

# Code Block {#id-CodeBlock}


<a id="org8b43609"></a>

## Init Setup {#id-InitSetUp}

Before inserting code blocks, emacs should enable the corresponding language while loading emacs
```elisp
      (org-babel-do-load-languages
      'org-babel-load-languages
      '((<LANGUAGE> . t));;If . nil means disable
    )
```
A useful variable of emacs `org-structure-template-alist` can be used as short-cut of code block,
to enable it, add:
```elisp
    (require 'org-tempo)
    ;org-tempo can also be added in "org-modules" variable
    ;"org-modules" is defined in org.el
```
The short key is `<s + TAB`
<sup><a id="fnr.4" class="footref" href="#fn.4" role="doc-backlink">4</a></sup>

To add more short key for specific languages<sup><a id="fnr.5" class="footref" href="#fn.5" role="doc-backlink">5</a></sup>, add:
```elisp
    (with-eval-after-load 'org
        (add-to-list 'org-structure-template-alist '("p" . "src python"))
        (add-to-list 'org-structure-template-alist '("j" . "src java"))
        (add-to-list 'org-structure-template-alist '("cpp" . "src cpp"))
      )
      ;Note that a, c, C, e, E, h, l, q, s, v has been used
```
Now the example short key is `<cpp + TAB`

Customize the backend support while exporting the code block,
press `M-x customize-option`, then `org-export-backends`.
Press `<RET>` on the checkbox of supported export languages to enable/disable it.
Now in export menu we can find mark down support.


<a id="org252e4b1"></a>

## Block Input {#id-blockInput}

Like latex, the code blocks source code looks like:

```emacs
    #+NAME: <name>
    #+BEGIN_SRC <language> <arguments>
    #+END_SRC
```


Then entering the `C-c + '` in between to start edit code.

Example of C++:
```cpp
for(int i=0;i<100;i++)
      {
        print(i);
      }
```
    

Example of Java:
```java[class="line-numbers"]
    import java.util.ArrayList;
    import java.util.Arrays;
    
    // create a unchecked exception class
    class CustomException extends RuntimeException {
      public CustomException(String message) {
        // call the constructor of RuntimeException
        super(message);
      }
    }
```

For inline code `~code~` is for `code`;


<a id="orga2f667c"></a>

## Latex setup {#id-LatexSetup}

For exporting with package `{mint}` in latex, as refer to CTAN, mint requires python and Pygments are installed.

    $python3 --version
    $pip3 install Pygments

The correponding configuration in emacs is:
```elisp
    (require 'ox-latex)
    (setq org-latex-listings 'minted
          org-latex-packages-alist '(("" "minted"))
          org-latex-pdf-process
          '("pdflatex -shell-escape -interaction nonstopmode -output-directory %o %f"
            "pdflatex -shell-escape -interaction nonstopmode -output-directory %o %f"))

```

The correponding mint style configuration in emacs is :
```elisp

    (setq org-latex-minted-options '(("<options>")
                                     ("<options>")
                                     )
    )

```
The "options" is latex mint environment option,
and will appear in front of each mint environment in tex.
<sup><a id="fnr.6" class="footref" href="#fn.6" role="doc-backlink">6</a></sup>

In generating latex file, mint also need to be included in latex header:


    #+latex_header: \usepackage{minted}

For changing mint Pygments font color style
<sup><a id="fnr.7" class="footref" href="#fn.7" role="doc-backlink">7</a></sup>, in latex header

    #+latex_header: \usemintedstyle{dracula}


<a id="org6d79c98"></a>

# Export {#id-export}

Insert export default setting: C-c C-e #, input "default";
Insert export latex settting: C-c C-e #, input "latex".

For pdf export(with latex support), C-C C-e l,
then input parameters:
l for export tex
p for export tex + pdf
o for export tex + pdf and open
&#x2026;


<a id="orgc5ce1f0"></a>

# Draw Ditaa image {#id-ditaa image}

Ditaa is no longer distributed with emacs.

Firstly enable the java diatt environment
and set the :
```elisp
    ;Enable Ditaa environment
    (org-babel-do-load-languages
      'org-babel-load-languages
      '((ditaa . t))
    )
    ;;Find ditaa,jar and set environment
    (setq org-ditaa-jar-path "<PATH OF DITAA.JAR>")

```

![img](figure/cycle1.png)

![img](figure/cycle2.png)


# Footnotes {#id-footnotes}

<sup><a id="fn.1" href="#fnr.1">1</a></sup> There is no need to indicate the first paragraph after title because obviously it's the start of the first paragraph.

<sup><a id="fn.2" href="#fnr.2">2</a></sup> Cycle means "folded-subtree–show all" or "overview–contents–show all"

<sup><a id="fn.3" href="#fnr.3">3</a></sup> Note that there are two columns after inline footnote and two newline after the seperate footnote

<sup><a id="fn.4" href="#fnr.4">4</a></sup> The 's' here is only for SRC environment, to generate other default environment, refer to `C-h v org-structure-template-alist RET`

<sup><a id="fn.5" href="#fnr.5">5</a></sup> The supported language list can be checked at [Babel: Languages](https://orgmode.org/worg/org-contrib/babel/languages/index.html)

<sup><a id="fn.6" href="#fnr.6">6</a></sup> The detail of minted environment options can be referred to CTAN.

<sup><a id="fn.7" href="#fnr.7">7</a></sup> More styles can be refered  to [Pygments Demo](https://pygments.org/demo/)
