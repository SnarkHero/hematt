<template>
  <div>
    <keep-alive exclude="SearchResult,sousuo,wenzhang,UserEdit">
      <router-view> </router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less"></style>
