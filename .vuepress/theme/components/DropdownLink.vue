<template>
  <div class="dropdown-wrapper" :class="{ open }">
    <a class="dropdown-title" @click="toggle">
      <span class="title">
        <reco-icon :icon="`${item.icon}`" />
        {{ item.text }}
      </span>
<!--      <span class="arrow" :class="open ? 'down' : 'right'">-->
      <div class="arrow"></div>
<!--      </span>-->
    </a>

    <DropdownTransition>
      <ul class="nav-dropdown" v-show="open">
        <li
          class="dropdown-item"
          :key="subItem.link || index"
          v-for="(subItem, index) in item.items"
        >
          <h4 v-if="subItem.type === 'links'">{{ subItem.text }}</h4>

          <ul
            class="dropdown-subitem-wrapper"
            v-if="subItem.type === 'links'"
          >
            <li
              class="dropdown-subitem"
              :key="childSubItem.link"
              v-for="childSubItem in subItem.items"
            ><NavLink :item="childSubItem"/></li>
          </ul>

          <NavLink v-else :item="subItem" />
        </li>
      </ul>
    </DropdownTransition>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue-demi'
import { RecoIcon } from '@vuepress-reco/core/lib/components'
import NavLink from '@theme/components/NavLink'
import DropdownTransition from '@theme/components/DropdownTransition'
import {useInstance} from "../helpers/composable";
import {isExternal} from "../helpers/utils";

export default defineComponent({
  components: { NavLink, DropdownTransition, RecoIcon },

  props: {
    item: {
      required: true
    }
  },

  setup (props, ctx) {
    const open = ref(false)

    const toggle = () => {
      open.value = !open.value
    }

    const isNavCurTitle = (subTitles) => {
      for (let subTitle of subTitles) {
        if (subTitle.items != null) {
          if (isNavCurTitle(subTitle.items)) {
            return true;
          }
        } else {
          let subLink = subTitle.link;
          if (subLink.startsWith("https://") || subLink.startsWith("http://")) {
            continue;
          }
          if (subLink.endsWith(".html")) {
            subLink = subLink.substring(0, subLink.lastIndexOf('/'))
          }
          if (useInstance().$route.path.startsWith(subLink)) {
            return true;
          }
        }
      }
      return false
    }

    return { open, toggle, isNavCurTitle }
  }
})
</script>

<style lang="stylus">
.dropdown-wrapper
  cursor pointer
  .dropdown-title
    display block
    &:hover
      border-color transparent
    .arrow
      vertical-align middle
      margin-top -1px
      margin-left 0.4rem
  .nav-dropdown
    .dropdown-item
      color inherit
      line-height 1.7rem
      h4
        margin 0.45rem 0 0
        border-top 1px solid var(--border-color)
        padding 0.95rem 1.5rem 0.45rem 1.25rem
        font-size 10px
        color: rgba(60, 60, 60, .33)
        font-weight 600
      .dropdown-subitem-wrapper
        padding 0
        list-style none
        .dropdown-subitem
          font-size 0.9em
      a
        display block
        line-height 1.7rem
        position relative
        border-bottom none
        font-weight 400
        margin-bottom 0
        padding 0 1.5rem 0 1.25rem
        &:hover
          color $accentColor
        &.router-link-active
          color $accentColor
          &::after
            content ""
            width 0
            height 0
            border-left 5px solid $accentColor
            border-top 3px solid transparent
            border-bottom 3px solid transparent
            position absolute
            top calc(50% - 2px)
            left 9px
      &:first-child h4
        margin-top 0
        padding-top 0
        border-top 0

@media (max-width: $MQMobile)
  .dropdown-wrapper
    &.open .dropdown-title
      margin-bottom 0.5rem
    .nav-dropdown
      transition height .1s ease-out
      overflow hidden
      .dropdown-item
        h4
          border-top 0
          margin-top 0
          padding-top 0
        h4, & > a
          font-size 15px
          line-height 2rem
        .dropdown-subitem
          font-size 14px
          padding-left 1rem

@media (min-width: $MQMobile)
  .dropdown-wrapper
    height 1.8rem
    &:hover .nav-dropdown
      // override the inline style.
      display block !important
    // 与下拉框重叠，目前没思考到好的样式，故舍弃
    //.nav-cur-active
    //  position relative
    //  &::after
    //    content ''
    //    position absolute
    //    bottom -17px
    //    left -8px
    //    width calc(100% + 16px)
    //    height 1px
    //    background-color #3eaf7c
    .dropdown-title .arrow
      // make the arrow always down at desktop
      //border-left 4px solid transparent
      //border-right 4px solid transparent
      //border-top 6px solid var(--text-color-sub)
      //border-bottom 0
      width 5px
      height 5px
      background-color transparent
      border-color var(--text-color-sub)
      border-style solid
      border-width 1.5px 1.5px 0 0
      margin-bottom 6px
      transform rotate(135deg)
    .nav-dropdown
      display none
      // Avoid height shaked by clicking
      height auto !important
      box-sizing border-box;
      max-height calc(100vh - 2.7rem)
      overflow-y auto
      position absolute
      top 100%
      right 0
      background-color var(--background-color)
      padding 0.6rem 0
      box-shadow: var(--box-shadow);
      text-align left
      border-radius $borderRadius
      white-space nowrap
      margin 0
</style>
