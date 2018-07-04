const ace = require('brace'),
  defaultConfig = {
    lang: 'json',
    theme: 'xcode',
    options: {
      useSoftTabs: true,
      tabSize: 2
    }
  };
let vm;
module.exports = {
  template: '<div :style="{height: height, width: width}"></div>',
  computed: {
    editorConfig() {
      return Object.assign({}, defaultConfig, this.config);
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    height: true,
    width: true,
    fontSize: {
      type: Number,
      default: 12
    },
    config: {
      type: Object,
      default: function () {
        return defaultConfig
      }
    }
  },
  data() {
    return {
      editor: null
    }
  },
  beforeDestroy: function () {
    this.editor.destroy();
    this.editor.container.remove();
  },
  mounted() {
    let vm = this,
      {
        lang,
        theme
      } = this.editorConfig,
      editor;

    lang === 'html' && require('brace/ext/emmet');
    require('brace/ext/language_tools');
    require('brace/mode/' + lang);
    require('brace/theme/' + theme);
    require('brace/snippets/' + lang);

    this.editor = editor = ace.edit(this.$el);
    
    editor.setTheme('ace/theme/' + theme);
    editor.setOption("enableEmmet", true);
    editor.getSession().setMode('ace/mode/' + lang);
    editor.$blockScrolling = Infinity;
    editor.setFontSize(this.fontSize);
    editor.setValue(this.value);
    this.editorConfig.options && editor.setOptions(this.editorConfig.options);

    this.$emit('init', editor);

    editor.on('change', _ => {
      vm.$emit('input', editor.getValue());
    });
  }
}
