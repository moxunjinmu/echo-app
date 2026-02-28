// miniprogram/components/ai-analysis/ai-analysis.js
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    analysis: {
      type: Object,
      value: {},
    },
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onAddToVocabulary(e) {
      const { word, meaning } = e.currentTarget.dataset;
      this.triggerEvent('addvocabulary', { word, meaning });
    },
  },
});
