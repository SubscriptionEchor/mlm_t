let mlmWorker;
let tierChart;
let commissionChart;
let isProcessing = false;

function initializeWebWorker() {
    if (window.Worker) {
        mlmWorker = new Worker('mlm-worker.js');
        mlmWorker.onmessage = handleWorkerMessage;
    }
}


// Add loader control functions
function showLoader(message = 'Processing...') {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loaderText');
    loaderText.textContent = message;
    loader.classList.remove('hidden');
    isProcessing = true;
}

function updateLoaderProgress(processed, total) {
    if (isProcessing) {
        const progress = Math.round((processed / total) * 100);
        document.getElementById('loaderProgress').textContent = `${progress}%`;
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    isProcessing = false;
}

// Update handleWorkerMessage function
function handleWorkerMessage(event) {
    const { type, data } = event.data;
    switch (type) {
        case 'networkProgress':
            updateLoaderProgress(data.processed, data.total);
            break;
        case 'networkComplete':
            updateMetrics(data.metrics);
            updateNetworkView(data.networkView);
            hideLoader();
            break;
        case 'transactionComplete':
            updateTransactions(data.transactions);
            updateMetrics(data.metrics);
            break;
        case 'validationUpdates':
            displayValidationUpdates(data);
            hideLoader();
            break;
        case 'transactionDetails':
            showTransactionModal(data);
            break;
        case 'error':
            hideLoader();
            displayError(data.message);
            break;
    }
}

// Add this function to handle the worker response
function showTransactionModal(transaction) {
    hideLoader();
    const modal = document.getElementById('transactionModal');
    const detailsDiv = document.getElementById('transactionDetails');
    
    if (!transaction) {
        displayError('Transaction details not found');
        return;
    }
    
    // Create detailed breakdown HTML
    let breakdownHtml = `
        <h3 class="text-lg font-medium mb-4">Transaction Details: ${transaction.id}</h3>
        <div class="bg-gray-50 p-4 rounded-lg space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-500">Sponsor</p>
                    <p class="font-medium">${transaction.sponsorId}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Total Commission</p>
                    <p class="font-medium text-green-600">$${transaction.totalCommission.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-medium mb-2">Commission Breakdown</h4>
                <div class="space-y-2">`;

    // Add detailed breakdown
    if (transaction.commissionsBreakdown && transaction.commissionsBreakdown.length > 0) {
        transaction.commissionsBreakdown.forEach(comm => {
            breakdownHtml += `
                <div class="flex justify-between items-center py-1 border-b border-gray-200">
                    <span class="text-sm">
                        ${comm.userId} - ${getCommissionTypeDescription(comm)}
                    </span>
                    <span class="font-medium">$${comm.amount.toFixed(2)}</span>
                </div>
            `;
        });
    } else {
        breakdownHtml += `<p class="text-sm text-gray-500">No commission details available</p>`;
    }

    breakdownHtml += `
                </div>
            </div>
        </div>
    `;

    detailsDiv.innerHTML = breakdownHtml;
    modal.classList.remove('hidden');
}

function initializeCharts() {
    // Tier Distribution Chart
    const tierCtx = document.getElementById('tierChart');
    tierChart = new Chart(tierCtx, {
        type: 'bar',
        data: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            datasets: [{
                label: 'Users per Tier',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.5)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} users`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Users'
                    }
                }
            }
        }
    });

    // Commission Distribution Chart
    const commissionCtx = document.getElementById('commissionChart');
    commissionChart = new Chart(commissionCtx, {
        type: 'bar',
        data: {
            labels: ['Direct', 'Difference', 'Level'],
            datasets: [{
                label: 'Commission Distribution',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(245, 158, 11, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    ticks: {
                        callback: value => `$${value}`
                    }
                }
            }
        }
    });
}

function updateMetrics(metrics) {
    // Update network overview
    document.getElementById('networkSizeMetric').textContent = metrics.networkSize.toLocaleString();
    
    // Update financial metrics
    document.getElementById('totalRevenue').textContent = 
        `$${metrics.totalRevenue.toLocaleString()}`;
    document.getElementById('totalCommission').textContent = 
        `$${metrics.totalCommissions.toLocaleString()}`;
    document.getElementById('profitMargin').textContent = 
        `$${(metrics.totalRevenue - metrics.totalCommissions).toLocaleString()}`;
    
    // Update tier distribution chart
    if (tierChart) {
        tierChart.data.datasets[0].data = [
            metrics.tierDistribution.T1,
            metrics.tierDistribution.T2,
            metrics.tierDistribution.T3,
            metrics.tierDistribution.T4,
            metrics.tierDistribution.T5,
            metrics.tierDistribution.T6,
            metrics.tierDistribution.T7
        ];
        tierChart.update();
    }

    // Update commission distribution chart
    if (commissionChart) {
        commissionChart.data.datasets[0].data = [
            metrics.commissionTypes.direct,
            metrics.commissionTypes.difference,
            metrics.commissionTypes.level
        ];
        commissionChart.update();
    }
}

function updateTransactions(transactions) {
    const list = document.getElementById('transactionsList');
    list.innerHTML = '';

    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tx.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tx.sponsorId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${tx.directCommission.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${tx.differenceIncome.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${tx.levelIncentives.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                $${tx.totalCommission.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="details-btn text-blue-600 hover:text-blue-800" data-transaction-id="${tx.id}">
                    Details
                </button>
            </td>
        `;
        
        // Add event listener to the Details button
        const detailsBtn = row.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            showCommissionBreakdown(tx.id);
        });
        
        list.appendChild(row);
    });
}


function showCommissionBreakdown(transactionId) {
    showLoader('Loading transaction details...');
    
    // Request transaction details from worker instead of accessing mlmNetwork directly
    mlmWorker.postMessage({
        type: 'getTransactionDetails',
        data: { transactionId }
    });
}


function getCommissionTypeDescription(commission) {
    switch (commission.type) {
        case 'direct':
            return `Direct Commission (Tier ${commission.tier})`;
        case 'difference':
            return `Difference Income (T${commission.fromTier} → T${commission.toTier})`;
        case 'level':
            return `Level ${commission.level} Incentive`;
        default:
            return commission.type;
    }
}

function updateNetworkView(networkView) {
    const viewer = document.getElementById('networkViewer');
    viewer.innerHTML = '';

    function createNodeElement(user, level = 0) {
        const div = document.createElement('div');
        div.className = level > 0 ? 'ml-6 border-l pl-2 border-gray-200' : '';
        
        const tierRequirements = getTierRequirements(user.currentTier);
        const statusClass = user.isActive ? 'text-green-600' : 'text-gray-400';
        
        // Format node text with all details
        const nodeText = `
            <div class="py-1 ${statusClass} flex items-center justify-between">
                <span class="flex-1">
                    ${level > 0 ? '├─ ' : ''}${user.userId}
                    <span class="text-xs text-gray-500">
                        (T${user.currentTier}: ${user.directReferrals}/${tierRequirements.directReferrals} DR, 
                        ${user.teamSize}/${tierRequirements.teamSize} TS)
                    </span>
                </span>
            </div>
        `;
        
        div.innerHTML = nodeText;
        return div;
    }

    function buildNetworkTree(users, parentId = null, level = 0) {
        // Get direct children
        const children = users.filter(u => u.uplineId === parentId);
        
        // Sort children by userId for consistent display
        children.sort((a, b) => a.userId.localeCompare(b.userId));
        
        children.forEach(user => {
            viewer.appendChild(createNodeElement(user, level));
            buildNetworkTree(users, user.userId, level + 1);
        });
    }

    buildNetworkTree(networkView);
}

function getTierRequirements(tier) {
    const requirements = {
        1: { directReferrals: 0, teamSize: 0 },
        2: { directReferrals: 3, teamSize: 0 },
        3: { directReferrals: 5, teamSize: 20 },
        4: { directReferrals: 8, teamSize: 75 },
        5: { directReferrals: 12, teamSize: 225 },
        6: { directReferrals: 16, teamSize: 700 },
        7: { directReferrals: 20, teamSize: 1500 }
    };
    return requirements[tier] || requirements[1];
}

function displayValidationUpdates(updates) {
    const validationResults = document.getElementById('validationResults');
    if (updates.length === 0) {
        validationResults.innerHTML = `
            <div class="p-4 bg-green-50 text-green-800 rounded">
                Network validation successful. All users meet their tier requirements.
            </div>
        `;
        return;
    }

    const updatesList = updates.map(update => `
        <li class="mb-2">
            ${update.userId}: T${update.oldTier} → T${update.newTier}
            (DR: ${update.directReferrals}, TS: ${update.teamSize})
        </li>
    `).join('');

    validationResults.innerHTML = `
        <div class="p-4 bg-yellow-50 text-yellow-800 rounded">
            <h4 class="font-medium">Tier Updates Required:</h4>
            <ul class="mt-2 list-disc pl-5">
                ${updatesList}
            </ul>
        </div>
    `;
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-50 text-red-800 p-4 rounded shadow';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    initializeWebWorker();
    initializeCharts();

    // Add button event listeners
    document.getElementById('generateBtn').addEventListener('click', generateNetwork);
   
    document.getElementById('validateBtn')?.addEventListener('click', () => {
        showLoader('Validating Network...');
        mlmWorker.postMessage({ type: 'validateNetwork' });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active', 'border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent');
            });
            button.classList.add('active', 'border-blue-500', 'text-blue-600');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${button.dataset.tab}Tab`).classList.remove('hidden');
        });
    });

    const modal = document.getElementById('transactionModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Update generateNetwork function
function generateNetwork() {
    const size = parseInt(document.getElementById('networkSize').value);
    if (size < 1 || size > 100000) {
        displayError('Please enter a network size between 1 and 100,000');
        return;
    }
    
    resetUI();
    showLoader('Generating Network...');
    mlmWorker.postMessage({ 
        type: 'generateNetwork',
        data: { size }
    });
}




function resetUI() {
    document.getElementById('networkSizeMetric').textContent = '0';
    document.getElementById('totalRevenue').textContent = '$0';
    document.getElementById('totalCommission').textContent = '$0';
    document.getElementById('profitMargin').textContent = '$0';
    document.getElementById('networkViewer').innerHTML = '';
    document.getElementById('transactionsList').innerHTML = '';
    document.getElementById('validationResults').innerHTML = '';
    
    if (tierChart) {
        tierChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
        tierChart.update();
    }
    if (commissionChart) {
        commissionChart.data.datasets[0].data = [0, 0, 0];
        commissionChart.update();
    }
}