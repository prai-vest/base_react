const a = {
  name: 'After Dark',
  type: 'dark',
  colors: {
    'editorLightBulb.foreground': '#88abf9',
    'editorLightBulbAutoFix.foreground': '#e8c37d',
    'editorUnnecessaryCode.opacity': '#000000b2',
    focusBorder: '#a8b6cc',
    'textBlockQuote.background': '#171f2c',
    'editor.background': '#0E131B',
    'editor.foreground': '#c8d1df',
    'activityBarBadge.background': '#0E131Bd2',
    'activityBar.background': '#0E131B',
    'activityBar.foreground': '#c8d1df',
    'activityBarBadge.foreground': '#c8d1df',
    'badge.background': '#0E131B',
    'button.background': '#0E131B',
    'debugToolBar.background': '#0E131Bd2',
    'debugToolBar.border': '#b38098',
    'dropdown.background': '#0E131B',
    'dropdown.border': '#181A1F',
    'editorError.foreground': '#e16ba0',
    'editorWarning.foreground': '#e0c084d5',
    'editorIndentGuide.activeBackground': '#6c8093d5',
    'editorIndentGuide.background': '#232f43',
    'editorMarkerNavigation.background': '#0E131B',
    'editorRuler.foreground': '#232f43',
    'editor.lineHighlightBackground': '#171f2c',
    'editor.selectionBackground': '#232f43',
    'editor.selectionHighlightBackground': '#171f2c',
    'editor.selectionHighlightBorder': '#a8b6cc',
    'editorCursor.background': '#c8d1df',
    'editorCursor.foreground': '#88abf9',
    'editorBracketMatch.border': '#6c8093c5',
    'editorBracketMatch.background': '#171f2c',
    'editor.findMatchBackground': '#171f2c',
    'editor.findMatchBorder': '#e8c37d',
    'editor.findMatchHighlightBackground': '#171f2c',
    'editor.findMatchHighlightBorder': '#a8b6cc',
    'editor.wordHighlightBackground': '#484e5b',
    'editor.wordHighlightBorder': '#7f848e',
    'editor.wordHighlightStrongBackground': '#abb2bf26',
    'editor.wordHighlightStrongBorder': '#7f848e',
    'editorGroup.emptyBackground': '#0E131B',
    'editorGroup.border': '#181A1F',
    'editorGroupHeader.tabsBackground': '#0E131B',
    'editorLineNumber.foreground': '#6c809370',
    'editorLineNumber.activeForeground': '#a8b6cc',
    'editorWhitespace.foreground': '#6c809370',
    'editorHoverWidget.background': '#0E131Bd2',
    'editorHoverWidget.border': '#a8b6cc',
    'editorSuggestWidget.foreground': '#a8b6cc',
    'editorSuggestWidget.background': '#0E131Bd2',
    'editorSuggestWidget.border': '#a8b6cc',
    'editorSuggestWidget.selectedBackground': '#232f43',
    'editorSuggestWidget.highlightForeground': '#88abf9',
    'editorWidget.background': '#0E131B',
    'input.background': '#0E131B',
    'list.activeSelectionBackground': '#232f43',
    'list.activeSelectionForeground': '#c8d1df',
    'list.focusBackground': '#292d35',
    'list.hoverBackground': '#0E131B',
    'list.hoverForeground': '#c8d1df',
    'list.highlightForeground': '#C5C5C5',
    'list.inactiveSelectionBackground': '#171f2c',
    'list.inactiveSelectionForeground': '#c8d1df',
    'list.errorForeground': '#ba7bcc',
    'list.dropBackground': '#232f43',
    'list.warningForeground': '#e8c37d', // Something needs to be done
    'peekViewEditor.matchHighlightBackground': '#171f2c',
    'scrollbarSlider.background': '#232f43',
    'scrollbarSlider.activeBackground': '#232f43',
    'scrollbarSlider.hoverBackground': '#232f43',
    'sideBar.background': '#0E131B',
    'sideBar.foreground': '#6c8093c5',
    'sideBarSectionHeader.background': '#0E131B',
    'statusBar.background': '#0E131B',
    'statusBar.foreground': '#6c8093c5',
    'statusBarItem.hoverBackground': '#171f2c',
    'statusBar.noFolderBackground': '#0E131B',
    'statusBar.debuggingBackground': '#ECBDCEd9',
    'statusBar.debuggingBorder': '#0E131Bd2',
    'statusBar.debuggingForeground': '#0E131B',
    'tab.activeBackground': '#0E131B',
    'tab.activeBorder': '#53c6bad5',
    'tab.activeForeground': '#c8d1df',
    'tab.inactiveForeground': '#6c8093',
    'tab.border': '#0E131B',
    'tab.inactiveBackground': '#0E131B',
    'tab.hoverBackground': '#0E131B',
    'tab.hoverBorder': '#53c6bad5',
    'tab.unfocusedHoverBackground': '#0E131B',
    'terminal.background': '#0E131B',
    'terminal.foreground': '#ba7bcc',
    'terminal.ansiBlack': '#0E131Bd2',
    'terminal.ansiBlue': '#7ecec6',
    'terminal.ansiGreen': '#98c379',
    'terminal.ansiYellow': '#e8c37d',
    'titleBar.activeBackground': '#0E131B',
    'titleBar.activeForeground': '#c8d1df',
    'titleBar.inactiveBackground': '#0E131B',
    'titleBar.inactiveForeground': '#6B717D',
    'gitDecoration.modifiedResourceForeground': '#88abf9d5',
    'gitDecoration.deletedResourceForeground': '#88abf9d5',
    'gitDecoration.addedResourceForeground': '#88abf9d5',
    'gitDecoration.untrackedResourceForeground': '#98c379',
    'gitDecoration.conflictingResourceForeground': '#e16ba0',
    'gitDecoration.ignoredResourceForeground': '#6c809386',
    'gitDecoration.submoduleResourceForeground': '#6c8093',
    'diffEditor.insertedTextBackground': '#00809B33',
    'editorGutter.modifiedBackground': '#88abf9d5',
    'editorGutter.addedBackground': '#98c379',
    'editorGutter.deletedBackground': '#ba7bcc',
    'settings.checkboxForeground': '#ba7bcc',
    'settings.modifiedItemIndicator': '#88abf9',
    'settings.checkboxBorder': '#c8d1df',
  },
  tokenColors: [
    // /// Javascript
    // ///////////////////
    {
      name: 'Nodejs module.export',
      scope: ['support.type.object.module'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'JavaScript this, *.prototype',
      scope: [
        'variable.language.this',
        'support.variable.property.js',
        'variable.language.arguments.js',
        'variable.language.self.js',
        'variable.language.proto.js',
        'variable.language.constructor.js',
        'variable.language.prototype.js',
      ],
      settings: {
        foreground: '#f386bf',
        fontStyle: 'italic',
      },
    },
    {
      name: 'DOM Variable',
      scope: ['support.variable.dom.js', 'support.variable'],
      settings: {
        foreground: '#e8c37d',
        fontStyle: '',
      },
    },
    {
      name: 'DOM Function',
      scope: 'support.function.dom.js',
      settings: {
        foreground: '#53c6ba',
        fontStyle: '',
      },
    },
    {
      name: 'JavaScript super',
      scope: 'variable.language.super',
      settings: {
        foreground: '#ba7bcc',
        fontStyle: 'italic',
      },
    },
    {
      name: 'JavaScript .trim([])',
      scope: ['meta.brace.square', 'meta.brace.round'],
      settings: {
        foreground: '#6c8093',
        fontStyle: '',
      },
    },
    {
      name: 'JavaScript Class new',
      scope: 'keyword.operator.new',
      settings: {
        foreground: '#f386bf',
      },
    },
    {
      name: 'JavaScript keywords: if, export, return etc',
      scope: 'keyword.control',
      settings: {
        foreground: '#ba7bcc',
      },
    },
    {
      name: 'Javascript the.last.propperty',
      scope: ['support.variable.property.dom.js', 'variable.other.property'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'JSX {}',
      scope: ['punctuation.section.embedded'],
      settings: {
        foreground: '#6c8093',
        fontStyle: '',
      },
    },
    {
      name: 'JSX Text inside components',
      scope: ['meta.tag'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'React Component',
      scope: ['support.class.component'],
      settings: {
        foreground: '#e8c37d',
      },
    },

    // ///////////////////
    // // JS Edge cases
    // {
    //   "name": "(const { *: value } of array)",
    //   "scope": [
    //     "meta.object-binding-pattern-variable.js variable.object.property.js",

    //   ],
    //   "settings": {
    //     "foreground": "#E6A26F"
    //   }
    // },
    // {
    //   "name": "(const { key: * } of array)",
    //   "scope": [
    //     "meta.object-binding-pattern-variable.js variable.other.constant.js",

    //   ],
    //   "settings": {
    //     "foreground": "#88abf9"
    //   }
    // },

    // Prisma
    {
      name: 'Mutation type',
      scope: ['source.graphql support.type.graphql', 'source.graphql support.type.enum.graphql'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'Data type of',
      scope: [
        'meta.variables.graphql support.type.graphql',
      ],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Built in',
      scope: [
        'support.type.builtin.graphql',
      ],
      settings: {
        foreground: '#e8c37d',
      },
    },
    {
      name: 'Variable',
      scope: ['variable.graphql'],
      settings: {
        foreground: '#E6A26F',
      },
    },
    {
      name: "Mandatory value operator '!'",
      scope: ['keyword.operator.nulltype.graphql'],
      settings: {
        foreground: '#f386bf',
      },
    },
    {
      name: 'Docstring',
      scope: [
        'source.graphql string.block.description.graphql.DOCSTRING',
        'source.graphql string.block.description.graphql.DOCSTRING punctuation.definition.string.graphql',
        'string.description.graphql',
        'punctuation.definition.string.graphql',
      ],
      settings: {
        foreground: '#b38098',
        fontStyle: 'italic', // KEEP ITALIC
      },
    },
// APOLLO GQL
    {
      name: 'String quotes and ${}',
      scope: [
        'punctuation.definition.string.graphql',
        'meta.embedded.block.graphql',
      ],
      settings: {
        foreground: '#6c8093',
        fontStyle: 'normal',
      },
    },
    {
      name: 'Built in types',
      scope: [
        'meta.arguments.graphql variable.graphql',
        'support.type.builtin.graphql',
      ],
      settings: {
        foreground: '#e8c37d',
      },
    },
    {
      name: '${vars}',
      scope: [
        'source.js meta.variables.graphql support.type.graphql',
      ],
      settings: {
        foreground: '#88abf9',
      },
    },

    // STYLED COMPONENTS
    {
      name: 'single variable',
      scope: ['source.css meta.property-list.media-query'],
      settings: {
        foreground: '#88abf9',
      },
    },

    {
      name: 'CSS Support',
      scope: ['source.css variable.other.readwrite'],
      settings: {
        foreground: '#c8d1df',
      },
    },

    {
      name: 'CSS Support',
      scope: ['source.css meta.property-name.media-query'],
      settings: {
        foreground: '#c8d1df',
      },
    },

    // /////// CSS
    // ////////////////////
    {
      name: 'CSS Support',
      scope: [
        'source.css support.type.property-name',
        'source.sass support.type.property-name',
        'source.scss support.type.property-name',
        'source.less support.type.property-name',
        'source.stylus support.type.property-name',
        'source.postcss support.type.property-name',
        'support.type.vendored.property-name',
      ],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'CSS @media',
      scope: [
        'source.css keyword.control.at-rule',
        'source.sass keyword.control.at-rule',
        'source.scss keyword.control.at-rule',
        'source.less keyword.control.at-rule',
        'source.stylus keyword.control.at-rule',
        'source.postcss keyword.control.at-rule',
      ],
      settings: {
        foreground: '#ba7bcc',
      },
    },
    {
      name: 'CSS &__element',
      scope: ['entity.other.attribute-name.parent-selector-suffix punctuation.definition.entity'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'CSS 1.2rem',
      scope: ['constant.numeric', 'keyword.other.unit'],
      settings: {
        foreground: '#E6A26F',
      },
    },
    {
      name: 'CSS &',
      scope: [
        'source.css entity.name.tag.reference',
        'source.sass entity.name.tag.reference',
        'source.scss entity.name.tag.reference',
        'source.less entity.name.tag.reference',
        'source.stylus entity.name.tag.reference',
        'source.postcss entity.name.tag.reference',
      ],
      settings: {
        foreground: '#6c8093',
        fontStyle: '',
      },
    },
    {
      name: 'CSS value/constant',
      scope: [
        'source.css support.constant.property-value',
        'source.sass support.constant.property-value',
        'source.scss support.constant.property-value',
        'source.less support.constant.property-value',
        'source.stylus support.constant.property-value',
        'source.postcss support.constant.property-value',
      ],
      settings: {
        foreground: '#c8d1df',
        fontStyle: '',
      },
    },
    {
      name: 'CSS variable',
      scope: [
        'source.css variable',
        'source.sass variable',
        'source.scss variable',
        'source.less variable',
        'source.stylus variable',
        'source.postcss variable',
      ],
      settings: {
        foreground: '#f386bf',
        fontStyle: '',
      },
    },
    {
      name: 'CSS unknown value',
      scope: [
        'source.css meta.property-value',
        'source.sass meta.property-value',
        'source.scss meta.property-value',
        'source.less meta.property-value',
        'source.stylus meta.property-value',
        'source.postcss meta.property-value',
      ],
      settings: {
        foreground: '#6c8093',
        fontStyle: '',
      },
    },
    {
      name: 'CSS Classes',
      scope: ['entity.other.attribute-name.class'],
      settings: {
        foreground: '#e8c37d',
        fontStyle: 'italic',
      },
    },
    {
      name: "CSS ID's",
      scope: ['source.sass keyword.control'],
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      name: 'CSS constants',
      scope: [
        'source.css support.constant',
        'source.sass support.constant',
        'source.scss support.constant',
        'source.less support.constant',
        'source.stylus support.constant',
        'source.postcss support.constant',
      ],
      settings: {
        foreground: '#c8d1df',
      },
    },
    // ///////////////
    // Clojure
    {
      scope: 'constant.keyword.clojure',
      settings: {
        foreground: '#E6A26F',
      },
    },
    {
      name: 'defn',
      scope: ['keyword.control.clojure'],
      settings: {
        foreground: '#ba7bcc',
        fontStyle: 'italic',
      },
    },
    {
      name: 'Clojure keywords',
      scope: ['meta.symbol.clojure', 'meta.var.clojure'],
      settings: {
        foreground: '#c8d1df',
        fontStyle: '',
      },
    },
    {
      name: 'if etc',
      scope: ['storage.control.clojure'],
      settings: {
        foreground: '#ba7bcc',
        fontStyle: '',
      },
    },
    {
      name: '@ /',
      scope: ['meta.expression.clojure'],
      settings: {
        foreground: '#f386bf',
        fontStyle: '',
      },
    },
    {
      scope: ['entity.global.clojure'],
      settings: {
        foreground: '#53c6ba',
        fontStyle: '',
      },
    },
    {
      name: 'state/',
      scope: ['meta.symbol.namespace.clojure'],
      settings: {
        foreground: '#53c6ba',
        fontStyle: 'italic',
      },
    },
    {
      name: 'reset!',
      scope: ['entity.name.function.clojure'],
      settings: {
        foreground: '#88abf9',
      },
    },
    // //////////////
    // Global
    {
      scope: 'meta.objectliteral',
      settings: {
        foreground: '#98c379',
      },
    },
    {
      scope: 'meta.object-literal.key',
      settings: {
        foreground: '#E6AC6F',
      },
    },
    {
      scope: 'keyword.operator',
      settings: {
        foreground: '#ba7bcc',
      },
    },
    {
      name: 'Comment',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        fontStyle: 'italic', // KEEP ITALIC
        foreground: '#b38098',
      },
    },
    {
      name: 'Variables',
      scope: ['variable',
        'variable.other.object.',
        'string constant.other.placeholder',
        'support.type.graphql',
      ],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'Colors',
      scope: ['constant.other.color', 'variable.parameter'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'Invalid',
      scope: ['invalid', 'invalid.illegal'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Keyword, Storage',
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: {
        foreground: '#ba7bcc',
      },
    },
    {
      name: 'Operator, Misc',
      scope: [
        'keyword.operator.type.annotation.ts',
        'constant.other.color',
        'punctuation',
        'punctuation.definition.tag',
        'punctuation.separator.inheritance.php',
        'punctuation.definition.tag.html',
        'punctuation.definition.tag.begin.html',
        'punctuation.definition.tag.end.html',
        'punctuation.definition.string',
        'keyword.other.template',
        'keyword.other.substitution',
      ],
      settings: {
        foreground: '#6c8093',
      },
    },
    {
      name: 'dot',
      scope: ['punctuation.accessor'],
      settings: {
        foreground: '#6c8093',
      },
    },

    {
      name: 'Tag',
      scope: ['entity.name.tag', 'meta.tag.sgml', 'markup.deleted.git_gutter'],
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      name: 'Function, Special Method',
      scope: [
        'entity.name.function',
        'meta.function-call',
        'variable.function',
        'support.function',
        'keyword.other.special-method',
      ],
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      name: 'Block Level Variables',
      scope: ['meta.block variable.other'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'Other Variable, String Link',
      scope: ['support.other.variable', 'string.other.link'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'Number, Constant, Function Argument, Embedded',
      scope: [
        'variable.other.constant',
        'constant.language',
        'support.constant',
        'constant.character',
        'constant.escape',
        'keyword.other',
      ],
      settings: {
        foreground: '#e8c37d',
      },
    },
    {
      name: 'undefined',
      scope: ['constant.language.undefined'],
      settings: {
        foreground: '#6c8093',
      },
    },
    {
      name: 'String, Symbols, Inherited Class, Markup Heading',
      scope: [
        'string',
        'constant.other.symbol',
        'constant.other.key',
        'markup.heading',
        'markup.inserted.git_gutter',
        'meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js',
        'source.css meta.attribute-selector',
      ],
      settings: {
        fontStyle: '',
        foreground: '#98c379',
      },
    },
    {
      name: 'Class, Support',
      scope: [
        'entity.name',
        'support.class',
        'support.orther.namespace.use.php',
        'entity.other.inherited-class',
        'meta.use.php',
        'support.other.namespace.php',
        'markup.changed.git_gutter',
        'support.type.sys-types',
      ],
      settings: {
        foreground: '#e8c37d',
      },
    },
    {
      name: 'Entity Types',
      scope: ['support.type'],
      settings: {
        foreground: '#f386bf',
      },
    },
    {
      name: 'Sub-methods',
      scope: ['entity.name.module.js', 'variable.import.parameter.js', 'variable.other.class.js'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Language methods',
      scope: ['variable.language'],
      settings: {
        fontStyle: 'italic',
        foreground: '#c8d1df',
      },
    },
    {
      name: 'entity.name.method.js',
      scope: ['entity.name.method.js'],
      settings: {
        fontStyle: 'italic',
        foreground: '#53c6ba',
      },
    },
    {
      name: 'meta.method.js',
      scope: ['meta.class-method.js entity.name.function.js', 'variable.function.constructor'],
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      name: 'Attributes',
      scope: [
        'entity.other.attribute-name',
        'text.html.basic entity.other.attribute-name.html',
        'text.html.basic entity.other.attribute-name',
      ],
      settings: {
        fontStyle: 'italic',
        foreground: '#E6AC6F',
      },
    },
    {
      name: 'Inserted',
      scope: ['markup.inserted'],
      settings: {
        foreground: '#98c379',
      },
    },
    {
      name: 'Deleted',
      scope: ['markup.deleted'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Changed',
      scope: ['markup.changed'],
      settings: {
        foreground: '#e8c37d',
      },
    },
    {
      name: 'Regular Expressions',
      scope: ['string.regexp'],
      settings: {
        foreground: '#98c379',
      },
    },
    {
      name: 'Regular Expressions',
      scope: ['punctuation.definition.group.regexp'],
      settings: {
        foreground: '#f386bf',
      },
    },
    {
      name: 'Regular Expressions',
      scope: ['constant.other.character-class.regexp'],
      settings: {
        foreground: '#E6A26F',
      },
    },
    {
      name: 'Regular Expressions',
      scope: ['string.regexp punctuation.definition.character-class.regexp'],
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      name: 'Regular Expressions start String',
      scope: [
        'string.regexp punctuation.definition.string.begin',
        'string.regexp punctuation.definition.string.end',
      ],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Escape Characters',
      scope: ['constant.character.escape'],
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      name: 'URL',
      scope: ['*url*', '*link*', '*uri*'],
      settings: {
        fontStyle: 'underline',
      },
    },
    {
      name: 'Decorators',
      scope: [
        'tag.decorator.js entity.name.tag.js',
        'tag.decorator.js punctuation.definition.tag.js',
      ],
      settings: {
        fontStyle: 'italic',
        foreground: '#53c6ba',
      },
    },
    {
      name: 'ES7 Bind Operator',
      scope: ['source.js constant.other.object.key.js string.unquoted.label.js'],
      settings: {
        fontStyle: 'italic',
        foreground: '#c8d1df',
      },
    },
    {
      name: 'JSON Key - Level 0',
      scope: ['source.json meta.structure.dictionary.json support.type.property-name.json'],
      settings: {
        foreground: '#E6A26F',
      },
    },
    {
      name: 'Markdown - Plain',
      scope: ['text.html.markdown', 'punctuation.definition.list_item.markdown'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markdown - Raw String',
      scope: ['text.html.markdown markup.inline.raw.string.markdown'],
      settings: {
        foreground: '#E6A26F',
      },
    },
    {
      name: 'Markdown - Markup Raw Inline',
      scope: ['text.html.markdown markup.inline.raw.markdown'],
      settings: {
        foreground: '#C792EA',
      },
    },
    {
      name: 'Markdown - Markup Raw Inline Punctuation',
      scope: [
        'text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown',
      ],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markdown - Line Break',
      scope: ['text.html.markdown meta.dummy.line-break'],
      settings: {
        foreground: '',
      },
    },
    {
      name: 'Markdown - Heading',
      scope: [
        'markdown.heading',
        'markup.heading | markup.heading entity.name',
        'markup.heading.markdown punctuation.definition.heading.markdown',
      ],
      settings: {
        foreground: '#98c379',
      },
    },
    {
      name: 'Markup - Italic',
      scope: ['markup.italic'],
      settings: {
        fontStyle: 'italic', // KEEP ITALIC
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markup - Bold',
      scope: ['markup.bold', 'markup.bold string'],
      settings: {
        fontStyle: 'bold',
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markup - Bold-Italic',
      scope: [
        'markup.bold markup.italic',
        'markup.italic markup.bold',
        'markup.quote markup.bold',
        'markup.bold markup.italic string',
        'markup.italic markup.bold string',
        'markup.quote markup.bold string',
      ],
      settings: {
        fontStyle: 'bold',
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markup - Underline',
      scope: ['markup.underline'],
      settings: {
        fontStyle: 'underline',
        foreground: '#E6AC6F',
      },
    },
    {
      name: 'Markup - Strike',
      scope: ['markup.strike'],
      settings: {
        fontStyle: 'strike',
        foreground: '',
      },
    },
    {
      name: 'Markdown - Blockquote',
      scope: ['markup.quote punctuation.definition.blockquote.markdown'],
      settings: {
        background: '#c8d1df',
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markup - Quote',
      scope: ['markup.quote'],
      settings: {
        fontStyle: 'italic',
        foreground: '',
      },
    },
    {
      name: 'Markdown - Link',
      scope: ['string.other.link.title.markdown'],
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      name: 'Markdown - Link Description',
      scope: ['string.other.link.description.title.markdown'],
      settings: {
        foreground: '#ba7bcc',
      },
    },
    {
      name: 'Markdown - Link Anchor',
      scope: ['constant.other.reference.link.markdown'],
      settings: {
        foreground: '#E6AC6F',
      },
    },
    {
      name: 'Markup - Raw Block',
      scope: ['markup.raw.block'],
      settings: {
        foreground: '#ba7bcc',
      },
    },
    {
      name: 'Markdown - Raw Block Fenced',
      scope: ['markup.raw.block.fenced.markdown'],
      settings: {
        foreground: '#00000050',
      },
    },
    {
      name: 'Markdown - Fenced Bode Block',
      scope: ['punctuation.definition.fenced.markdown'],
      settings: {
        foreground: '#00000050',
      },
    },
    {
      name: 'Markdown - Fenced Bode Block Variable',
      scope: [
        'markup.raw.block.fenced.markdown',
        'variable.language.fenced.markdown',
        'punctuation.section.class.end',
      ],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markdown - Fenced Language',
      scope: ['variable.language.fenced.markdown'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markdown - Separator',
      scope: ['meta.separator'],
      settings: {
        fontStyle: 'bold',
        background: '#00000050',
        foreground: '#c8d1df',
      },
    },
    {
      name: 'Markup - Table',
      scope: ['markup.table'],
      settings: {
        foreground: '#c8d1df',
      },
    },
    {
      scope: 'token.info-token',
      settings: {
        foreground: '#53c6ba',
      },
    },
    {
      scope: 'token.warn-token',
      settings: {
        foreground: '#e8c37d',
      },
    },
    {
      scope: 'token.error-token',
      settings: {
        foreground: '#88abf9',
      },
    },
    {
      scope: 'token.debug-token',
      settings: {
        foreground: '#ba7bcc',
      },
    },
  ],
}
