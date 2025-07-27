// 模擬數據
const applianceData = {
    ac: { name: '冷氣', power: 2.5, status: true, icon: '❄️' },
    light: { name: '燈光', power: 0.3, status: true, icon: '💡' },
    tv: { name: '電視', power: 0.0, status: false, icon: '📺' },
    fridge: { name: '冰箱', power: 0.8, status: true, icon: '🧊' }
};

// 用電量數據
const consumptionData = {
    week: [
        { day: '週一', value: 22.5 },
        { day: '週二', value: 24.8 },
        { day: '週三', value: 21.3 },
        { day: '週四', value: 26.1 },
        { day: '週五', value: 28.4 },
        { day: '週六', value: 25.7 },
        { day: '週日', value: 23.2 }
    ],
    month: [
        { day: '第1週', value: 156.8 },
        { day: '第2週', value: 142.3 },
        { day: '第3週', value: 168.9 },
        { day: '第4週', value: 175.2 }
    ]
};

// 每日用電時段數據
const dailyUsageData = [
    { hour: '00:00', power: 1.2 },
    { hour: '02:00', power: 0.8 },
    { hour: '04:00', power: 0.6 },
    { hour: '06:00', power: 1.5 },
    { hour: '08:00', power: 2.8 },
    { hour: '10:00', power: 3.2 },
    { hour: '12:00', power: 3.8 },
    { hour: '14:00', power: 4.1 },
    { hour: '16:00', power: 3.9 },
    { hour: '18:00', power: 4.5 },
    { hour: '20:00', power: 4.2 },
    { hour: '22:00', power: 3.1 }
];

// 即時監控數據
let realtimeData = [];
for (let i = 0; i < 24; i++) {
    realtimeData.push({
        time: i,
        power: Math.random() * 2 + 2
    });
}

// 初始化儀表板
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    initializeApplianceControls();
    initializeTimeToggle();
    createConsumptionChart();
    createDailyUsageChart();
    createRealtimeChart();
    updateApplianceRanking();
    updateTopConsumer();
    
    // 每秒更新時間
    setInterval(updateDateTime, 1000);
    
    // 每5秒更新即時數據
    setInterval(updateRealtimeData, 5000);
});

// 更新日期時間
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    
    timeElement.textContent = now.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    dateElement.textContent = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

// 初始化家電控制
function initializeApplianceControls() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const applianceId = this.id.replace('Toggle', '');
            const appliance = applianceData[applianceId];
            const statusElement = document.getElementById(applianceId + 'Status');
            const powerElement = this.closest('.appliance-item').querySelector('.power');
            
            if (this.checked) {
                appliance.status = true;
                appliance.power = getDefaultPower(applianceId);
                statusElement.textContent = '開啟';
                statusElement.classList.remove('off');
            } else {
                appliance.status = false;
                appliance.power = 0;
                statusElement.textContent = '關閉';
                statusElement.classList.add('off');
            }
            
            powerElement.textContent = appliance.power.toFixed(1) + ' kW';
            updateTopConsumer();
            updateApplianceRanking();
            updateRealtimeData();
        });
    });
}

// 獲取預設功率
function getDefaultPower(applianceId) {
    const defaultPowers = {
        ac: 2.5,
        light: 0.3,
        tv: 0.8,
        fridge: 0.8
    };
    return defaultPowers[applianceId] || 0;
}

// 初始化時間切換
function initializeTimeToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active類別
            toggleBtns.forEach(b => b.classList.remove('active'));
            // 添加active類別到當前按鈕
            this.classList.add('active');
            
            const period = this.dataset.period;
            updateConsumptionDisplay(period);
            createConsumptionChart(period);
        });
    });
}

// 更新用電量顯示
function updateConsumptionDisplay(period = 'week') {
    const data = consumptionData[period];
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const avg = total / data.length;
    
    document.getElementById('consumptionValue').textContent = total.toFixed(1);
    
    // 模擬變化率
    const change = (Math.random() - 0.5) * 20;
    const changeElement = document.querySelector('.change-value');
    const arrowElement = document.querySelector('.change-arrow');
    
    if (change > 0) {
        changeElement.textContent = '+' + change.toFixed(1) + '%';
        changeElement.style.color = '#2ecc71';
        arrowElement.textContent = '↗';
        arrowElement.style.color = '#2ecc71';
    } else {
        changeElement.textContent = change.toFixed(1) + '%';
        changeElement.style.color = '#e74c3c';
        arrowElement.textContent = '↘';
        arrowElement.style.color = '#e74c3c';
    }
}

// 創建用電量圖表
function createConsumptionChart(period = 'week') {
    const data = consumptionData[period];
    
    Highcharts.chart('consumptionChart', {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            height: 200
        },
        title: {
            text: null
        },
        xAxis: {
            categories: data.map(item => item.day),
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#7f8c8d'
                }
            },
            lineColor: '#ecf0f1',
            tickColor: '#ecf0f1'
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#7f8c8d'
                }
            },
            gridLineColor: '#ecf0f1'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#667eea'],
                        [1, '#764ba2']
                    ]
                },
                borderRadius: 4,
                borderWidth: 0
            }
        },
        series: [{
            name: '用電量',
            data: data.map(item => item.value)
        }],
        credits: {
            enabled: false
        }
    });
}

// 創建每日用電時段圖表
function createDailyUsageChart() {
    const peakHour = dailyUsageData.reduce((max, item) => 
        item.power > max.power ? item : max
    );
    
    document.getElementById('peakTime').textContent = 
        peakHour.hour + ' - ' + getNextHour(peakHour.hour);
    document.getElementById('peakPower').textContent = peakHour.power.toFixed(1) + ' kW';
    
    Highcharts.chart('dailyUsageChart', {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            height: 200
        },
        title: {
            text: null
        },
        xAxis: {
            categories: dailyUsageData.map(item => item.hour),
            labels: {
                style: {
                    fontSize: '11px',
                    color: '#7f8c8d'
                }
            },
            lineColor: '#ecf0f1',
            tickColor: '#ecf0f1'
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#7f8c8d'
                }
            },
            gridLineColor: '#ecf0f1'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(102, 126, 234, 0.3)'],
                        [1, 'rgba(102, 126, 234, 0.05)']
                    ]
                },
                lineColor: '#667eea',
                lineWidth: 2,
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            name: '用電量',
            data: dailyUsageData.map(item => item.power)
        }],
        credits: {
            enabled: false
        }
    });
}

// 獲取下一個小時
function getNextHour(hour) {
    const [h, m] = hour.split(':');
    const nextHour = (parseInt(h) + 1) % 24;
    return nextHour.toString().padStart(2, '0') + ':' + m;
}

// 創建即時監控圖表
function createRealtimeChart() {
    Highcharts.chart('realtimeChart', {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
            height: 200
        },
        title: {
            text: null
        },
        xAxis: {
            categories: realtimeData.map(item => item.time + ':00'),
            labels: {
                style: {
                    fontSize: '11px',
                    color: '#7f8c8d'
                }
            },
            lineColor: '#ecf0f1',
            tickColor: '#ecf0f1'
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#7f8c8d'
                }
            },
            gridLineColor: '#ecf0f1'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            spline: {
                lineColor: '#27ae60',
                lineWidth: 3,
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            name: '即時用電',
            data: realtimeData.map(item => item.power)
        }],
        credits: {
            enabled: false
        }
    });
}

// 更新即時數據
function updateRealtimeData() {
    // 更新總用電量
    const totalPower = Object.values(applianceData)
        .reduce((sum, appliance) => sum + appliance.power, 0);
    
    document.getElementById('totalPower').textContent = totalPower.toFixed(1) + ' kW';
    
    // 更新今日用電
    const todayUsage = (totalPower * 24 * 0.4).toFixed(1);
    document.getElementById('todayUsage').textContent = todayUsage + ' kWh';
    
    // 更新本月預估
    const monthlyEstimate = Math.round(todayUsage * 30);
    document.getElementById('monthlyEstimate').textContent = monthlyEstimate + ' kWh';
    
    // 更新電費預估
    const costEstimate = Math.round(monthlyEstimate * 4);
    document.getElementById('costEstimate').textContent = '$' + costEstimate.toLocaleString();
    
    // 更新即時圖表數據
    realtimeData.shift();
    realtimeData.push({
        time: (realtimeData[realtimeData.length - 1].time + 1) % 24,
        power: Math.random() * 2 + 2
    });
    
    // 重新繪製圖表
    createRealtimeChart();
}

// 更新耗電量最高家電
function updateTopConsumer() {
    const appliances = Object.entries(applianceData)
        .filter(([id, appliance]) => appliance.status)
        .sort((a, b) => b[1].power - a[1].power);
    
    if (appliances.length > 0) {
        const [topId, topAppliance] = appliances[0];
        const totalPower = appliances.reduce((sum, [id, appliance]) => sum + appliance.power, 0);
        const percentage = Math.round((topAppliance.power / totalPower) * 100);
        
        document.getElementById('topApplianceName').textContent = topAppliance.name;
        document.getElementById('topAppliancePower').textContent = topAppliance.power.toFixed(1) + ' kW';
        document.getElementById('topAppliancePercentage').textContent = percentage + '%';
        document.querySelector('.appliance-icon-large').textContent = topAppliance.icon;
        
        // 模擬使用時間
        const hours = Math.floor(Math.random() * 5) + 1;
        const minutes = Math.floor(Math.random() * 60);
        document.getElementById('topApplianceTime').textContent = 
            `已使用 ${hours} 小時 ${minutes} 分鐘`;
    }
}

// 更新家電耗電排行
function updateApplianceRanking() {
    const rankingContainer = document.getElementById('applianceRanking');
    const appliances = Object.entries(applianceData)
        .filter(([id, appliance]) => appliance.status)
        .sort((a, b) => b[1].power - a[1].power);
    
    rankingContainer.innerHTML = '';
    
    appliances.forEach(([id, appliance], index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <span class="ranking-name">${appliance.name}</span>
            <span class="ranking-power">${appliance.power.toFixed(1)} kW</span>
        `;
        rankingContainer.appendChild(rankingItem);
    });
}

// 添加一些隨機變化來模擬真實環境
setInterval(() => {
    // 隨機調整家電功率
    Object.keys(applianceData).forEach(id => {
        if (applianceData[id].status) {
            const variation = (Math.random() - 0.5) * 0.2;
            applianceData[id].power = Math.max(0, applianceData[id].power + variation);
            
            // 更新顯示
            const powerElement = document.querySelector(`[data-appliance="${id}"] .power`);
            if (powerElement) {
                powerElement.textContent = applianceData[id].power.toFixed(1) + ' kW';
            }
        }
    });
    
    updateTopConsumer();
    updateApplianceRanking();
}, 10000); // 每10秒更新一次 