<template>
  <div class="code-tabs">
    <div class="tabs-header">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-button', { active: activeTab === index }]"
        @click="activeTab = index"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="tabs-content">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        v-show="activeTab === index"
        class="tab-pane"
      >
        <slot :name="`tab-${index}`"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeTabs',
  props: {
    titles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeTab: 0
    }
  },
  computed: {
    tabs() {
      return this.titles.map(title => ({ title }))
    }
  }
}
</script>

<style scoped>
.code-tabs {
  margin: 1rem 0;
  border: 1px solid #eaecef;
  border-radius: 6px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background-color: #fdfdfd;
  border-bottom: 1px dashed #eaecef;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #3eaf7c;
}

.tab-button.active {
  color: #3eaf7c;
  border-bottom-color: #3eaf7c;
  /* font-weight: 600; */
}

.tabs-content {
  background-color: #fff;
}

.tab-pane {
  padding: 0;
}

.tab-pane >>> pre {
  margin: 0;
  border-radius: 0;
}

/* 用代码组时，将代码块本身的边框除掉 */
.content__default pre, .content__default pre[class*=language-] {
    border: none !important;
}
div[class*="language-"].line-numbers-mode::after {
    border-top: none !important;
    border-left: none !important;
    border-bottom: none !important;
}
</style>