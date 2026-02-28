// components/course-card/course-card.js
Component({
  properties: {
    course: {
      type: Object,
      value: {},
    },
  },

  data: {
    difficultyText: '',
  },

  observers: {
    'course.difficulty': function (difficulty) {
      const difficultyMap = {
        beginner: '初级',
        intermediate: '中级',
        advanced: '高级',
      };
      this.setData({
        difficultyText: difficultyMap[difficulty] || difficulty,
      });
    },
  },

  methods: {
    handleTap() {
      const { course } = this.properties;
      this.triggerEvent('tap', { course });
    },
  },
});
