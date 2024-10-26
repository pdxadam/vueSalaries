<script setup>
    import { Tabs } from 'buefy';
    import Scenario from '../classes/Scenario.js';
    import Salaries from './Salaries.vue';

    const props = defineProps({
        scenario: Scenario,
    }
    );

</script>
<template>
    <h1>Scenario: {{ scenario.title }}</h1>
    <h5>{{ scenario.description }}</h5>
    <h5>Total Cost of this scenario: {{ scenario.getTotalCost() }}</h5>
    <b-tabs type="is-boxed" expanded>
        <b-tab-item v-for = "schedule in scenario.schedules" :label = schedule.title>
            <Salaries :schedule = schedule />
        </b-tab-item>
    </b-tabs>

</template>
<style scoped>

</style>