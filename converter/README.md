# Angelcode (.fnt) to SimpleWebGLText (.json) Converter

This converter converts `.fnt` files, which are in the Angelcode format to a JSON format called SimpleWebGLText (`.json`)

## SimpleWebGLText Specification (v 1.0)

The SimpleWebGLText format has been invented to allow for easy loading and parsing of the font file data. It is better than other JSON based font info descriptions since the use of arrays reduces loopup times.

    {  
       "chars":{},
       "info":{},
       "kernings":{}
    }
    
The basic file structure is a JavaScript array with three children of type array called chars, info and kernings.

#### Chars Subarray

The chars array contains a child for each character that should be described, whose key is the UNICODE index for the character.

The following is the description of the character Latin-small-x:

    "88":{  
        "xadvance":"53",
        "yoffset":"4",
        "x":"185",
        "width":"56",
        "xoffset":"-8",
        "y":"261",
        "height":"61"
    }
    
#### Info Subarray

The info array contains a information that is shared between characters auch as lineHeight and text base.

The following is the content of the info array for the typeface "Arial":

    "lineHeight":"85",
    "base":"57"
    
#### Concluding

A full sample SimpleWebGLText file for the font Arial can be found [here]().

Each subarray can be extended with data that might be needed by the text renderer.

# Development

Want to contribute? Great!

License
----
Written by Gero Gerke

 * Arial Font Copyright Robin Nicholas and Patricia Saunders
 * Comic Sans Font Copyright Microsoft

[![WTFPL License](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png)](http://www.wtfpl.net/)


**Free Software, Hell Yeah!**