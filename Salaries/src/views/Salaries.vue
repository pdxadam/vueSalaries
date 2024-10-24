<script setup>
    import Schedule from '../classes/Schedule.js'
    import Cellvue from '../components/Cellvue'

    const schedule = ref(Schedule.SeedSchedule("TestSchedule", 15, 7))
    
</script>
<template>
    <header>test</header>
    <table>
        <tr>
            <th v-for="col in schedules.colTitles">{{ col }}</th>
        </tr>
        <tr v-for = "(s, index) in schedule.cells">
            <th>{{ schedule.rowTitles[index] }}</th>
            <Cellvue v-for="cell in s" />
        </tr>
    </table>
</template>