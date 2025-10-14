// ReadTheDocs REST API 集成
class ReadTheDocsAPI {
    constructor(project = 'changzhiming') {
        this.baseUrl = 'https://readthedocs.org/api/v3';
        this.project = project;
    }

    // 获取项目信息
    async getProject() {
        try {
            const response = await fetch(`${this.baseUrl}/projects/${this.project}/`);
            return await response.json();
        } catch (error) {
            console.error('获取项目信息失败:', error);
            return null;
        }
    }

    // 获取所有版本
    async getVersions() {
        try {
            const response = await fetch(`${this.baseUrl}/projects/${this.project}/versions/`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('获取版本列表失败:', error);
            return [];
        }
    }

    // 获取构建信息
    async getBuilds() {
        try {
            const response = await fetch(`${this.baseUrl}/projects/${this.project}/builds/`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('获取构建信息失败:', error);
            return [];
        }
    }

    // 触发构建
    async triggerBuild(version = 'latest') {
        try {
            const response = await fetch(`${this.baseUrl}/projects/${this.project}/versions/${version}/builds/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('触发构建失败:', error);
            return null;
        }
    }

    // 获取API令牌 (需要在环境变量中配置)
    getToken() {
        return process.env.READTHEDOCS_TOKEN || '';
    }
}

// 初始化API实例
const rtdAPI = new ReadTheDocsAPI('changzhiming');

// 页面加载时获取版本信息
document.addEventListener('DOMContentLoaded', async function() {
    console.log('ReadTheDocs API 已初始化');

    // 获取项目信息
    const projectInfo = await rtdAPI.getProject();
    if (projectInfo) {
        console.log('项目信息:', projectInfo);
    }

    // 获取版本列表
    const versions = await rtdAPI.getVersions();
    if (versions.length > 0) {
        console.log('可用版本:', versions.map(v => v.slug));

        // 动态更新版本选择器
        updateVersionSelector(versions);
    }

    // 获取最新构建状态
    const builds = await rtdAPI.getBuilds();
    if (builds.length > 0) {
        const latestBuild = builds[0];
        console.log('最新构建状态:', latestBuild.state, latestBuild.date);
        showBuildStatus(latestBuild);
    }
});

// 更新版本选择器
function updateVersionSelector(versions) {
    const dropdown = document.getElementById('versionDropdown');
    if (!dropdown) return;

    // 清空现有选项
    dropdown.innerHTML = '';

    // 添加API获取的版本
    versions.forEach((version, index) => {
        const option = document.createElement('div');
        option.className = 'version-option' + (index === 0 ? ' active' : '');
        option.dataset.version = version.slug;
        option.textContent = `${version.verbose_name} ${version.active ? '(活跃)' : ''}`;
        dropdown.appendChild(option);
    });
}

// 显示构建状态
function showBuildStatus(build) {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'buildStatus';
    statusIndicator.innerHTML = `
        <div style="
            position: fixed; bottom: 70px; right: 20px; z-index: 999;
            background: ${build.state === 'finished' ? '#4CAF50' : build.state === 'building' ? '#FF9800' : '#f44336'};
            color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px;
        ">
            构建状态: ${build.state}
        </div>
    `;
    document.body.appendChild(statusIndicator);

    // 5秒后自动隐藏
    setTimeout(() => {
        const element = document.getElementById('buildStatus');
        if (element) element.remove();
    }, 5000);
}

// 导出API实例供其他脚本使用
window.ReadTheDocsAPI = ReadTheDocsAPI;
window.rtdAPI = rtdAPI;