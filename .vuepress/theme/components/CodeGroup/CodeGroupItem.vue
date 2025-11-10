<template>
  <div v-show="isActive" class="tab-pane">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CodeGroupItem',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      itemIndex: 0
    }
  },
  computed: {
    isActive() {
      return this.$parent.activeTab === this.itemIndex;
    }
  }
}
</script>

<style scoped>
.tab-pane {
  padding: 0;
}

.tab-pane >>> pre {
  margin: 0;
  border-radius: 0;
}
</style>
