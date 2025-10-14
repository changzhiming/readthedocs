// 版本选择器功能
document.addEventListener('DOMContentLoaded', function() {
    // 创建版本选择器HTML
    const versionSelector = `
        <div class="version-selector" id="versionSelector">
            <span id="currentVersion">v2.0</span>
            <div class="version-dropdown" id="versionDropdown">
                <div class="version-option active" data-version="v2.0">版本 2.0 (当前)</div>
                <div class="version-option" data-version="v1.9">版本 1.9</div>
                <div class="version-option" data-version="v1.8">版本 1.8</div>
                <div class="version-option" data-version="v1.7">版本 1.7</div>
                <div class="version-option" data-version="latest">最新开发版</div>
            </div>
        </div>
    `;

    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', versionSelector);

    // 获取元素
    const selector = document.getElementById('versionSelector');
    const dropdown = document.getElementById('versionDropdown');
    const currentVersionSpan = document.getElementById('currentVersion');
    const options = dropdown.querySelectorAll('.version-option');

    // 点击选择器显示/隐藏下拉菜单
    selector.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // 点击版本选项
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();

            // 移除所有active类
            options.forEach(opt => opt.classList.remove('active'));

            // 添加active类到当前选项
            this.classList.add('active');

            // 更新显示的版本
            const version = this.dataset.version;
            currentVersionSpan.textContent = version;

            // 隐藏下拉菜单
            dropdown.classList.remove('show');

            // ReadTheDocs版本切换逻辑
            console.log('切换到版本:', version);

            // ReadTheDocs URL模式
            const currentHost = window.location.hostname;
            if (currentHost.includes('readthedocs.io')) {
                // ReadTheDocs托管环境
                const baseUrl = currentHost.replace(/\/[^\/]*$/, '');
                window.location.href = `https://${baseUrl}/zh/${version}/`;
            } else {
                // 本地开发环境 - 显示提示
                console.log(`在ReadTheDocs环境中，将跳转到: https://changzhiming.readthedocs.io/zh/${version}/`);

                // 可选：显示提示信息
                const notification = document.createElement('div');
                notification.innerHTML = `版本切换到 ${version} (在ReadTheDocs环境中生效)`;
                notification.style.cssText = `
                    position: fixed; top: 20px; right: 20px; z-index: 9999;
                    background: #4CAF50; color: white; padding: 10px 15px;
                    border-radius: 4px; font-size: 14px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                `;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }
        });
    });

    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        dropdown.classList.remove('show');
    });
});