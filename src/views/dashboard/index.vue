<template>
  <div class="dashboard-container">

    <TopCard />
    <SaleCard />
    <Observe />
  </div>
</template>

<script>
import TopCard from './topCard'
import SaleCard from './saleCard'
import Observe from './observe'
export default {
  name: 'Dashboard',
  components: {
    TopCard,
    SaleCard,
    Observe
  }

}
</script>

<style lang="scss" scoped>

</style>
