<script>
import { Bar, mixins } from 'vue-chartjs';
const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
};
export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  mounted() {
    this.renderChart(this.chartData, OPTIONS);
  },
};
</script>
