<template>
  <div class="code-tabs">
    <div class="tabs-header">
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="['tab-button', { active: activeTab === index }]"
        @click="activeTab = index"
      >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" class="xicon-icon" style="width: 17px; height: 17px; font-size: 17px;"><path d="M31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9l7 7z" fill="currentColor"></path><path d="M1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23l-7-7z" fill="currentColor"></path><path d="M12.419 25.484L17.639 6l1.932.518L14.35 26z" fill="currentColor"></path></svg>
        <div class="tab-button-text">{{ item.title }}</div>
      </button>
    </div>
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeGroup',
  data() {
    return {
      activeTab: 0,
      items: []
    }
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    loadItems() {
      // 获取所有 CodeGroupItem 子组件
      this.items = [];
      const children = this.$children || [];
      
      children.forEach((child, index) => {
        if (child.$options.name === 'CodeGroupItem') {
          this.items.push({
            title: child.title,
            index: index
          });
          // 设置子组件的索引
          child.itemIndex = this.items.length - 1;
        }
      });
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
  font-family: ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
  display: flex;
  align-items: center;
}

.tab-button:hover {
  color: #3eaf7c;
}

.tab-button.active {
  color: #3eaf7c;
  border-bottom-color: #3eaf7c;
}

.tab-button-text {
  margin-left: 0.4rem;
}

.tabs-content {
  background-color: #fff;
}

/* 用代码组时，将代码块本身的边框除掉 */
.code-tabs >>> pre[class*=language-] {
  border: none !important;
}
.code-tabs >>> div[class*="language-"].line-numbers-mode::after {
  border-top: none !important;
  border-left: none !important;
  border-bottom: none !important;
  border-top-left-radius: 0 !important;
}
</style>
