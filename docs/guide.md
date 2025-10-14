
# 整机所有启动流程

```mermaid

stateDiagram-v2

    sdk_start --> ready: 准备关节
    ready --> zero : 关节全部归零位(算法准备) init
    zero --> activate: 可以被算法控制

    activate --> mpc : 上肢控制
    activate --> rl : 下肢控制

    mpc --> 遥操作
    mpc --> 播放动作

    rl --> 上肢静止
    rl --> 上肢摆动

    上肢摆动 --> mpc : 互斥只能启动一个

```

# 启动代码

1. sdk启动
   1. bash hw_no_hand_pos.sh
2. 关节准备
   1. bash ready.sh
3. 关节归零位(算法准备) init
    1. bash zero.sh  或   bash lift.sh  或   bash mpc_init_pos.sh
4. 关节激活，可以被算法控制
   1. bash activate.sh
5. 下肢控制 rl
   1. rbevent启动rbevent：cd /root/xbot/algorithm/teleopx/rboperation && ./rbevent
   2. 启动rl python pub_client.py --type rl --cmd start
6. 上肢控制 mpc
   1. cd /root/xbot/algorithm/mpc/install/scripts/
   2. python pub_client.py --type mpc --cmd start
7. webxr启动
   1. conda activate teleoop
   2. cd /root/xbot/algorithm/teleopx/webxr/
   3. bash exec.sh
8. retarget启动
   1. conda activate teleop
   2. cd /root/xbot/algorithm/teleopx/retargetx
   3. bash exec.sh
9. 启动遥操作
   1. ros2 service call /Start_EE_Retarget std_srvs/srv/Trigger

# 代码启动

> 总体启动

```mermaid
sequenceDiagram
    %% 参与者定义
    participant auto_start as auto_start.py(开机启动)
    participant launch_manage as xbot_launch_manager_node(开机启动)
    participant xbot.launch.py as xbot.launch.py
    participant xbot_state_manager as xbot_state_manager
    participant xbot_control as xbot_control(ros2_control_node)

    %% 注释
    Note over auto_start: 加载配置文件config.yaml<br>(auto_start, launch_mode,robot_type,hardware_type)

    %% 注释
    Note over xbot_state_manager: 状态 <br>[Init<br>IDLE<br>Ready<br>Active<br>Error<br>SHUTDOWN]

    %% 注释
    Note over launch_manage: 服务 <br>dynamic_launch(启动xbot_control)<br>['ros2', 'launch', package ,"xbot.launch.py"]<br>stop_launch(停止xbot_control)

    %% 注释
    Note over xbot_state_manager: 服务 <br>[clean_error_service<br>ready_service,ota_service<br>shutdown_service<br>emergency_service<br>activate_service<br>deactivate_service<br>error_service<br>emergency_lifted_service]

    %% 注释
    Note over xbot_control: [ros2_control标准]<br>启动contrioller_manager<br>加载controller配置文件<br>加载硬件配置文件

    %% 注释
    Note over xbot.launch.py: joint_state_broadcaster(关节状态发布)<br>robot_state_publisher(机器人状态发布)<br>xbot_state_manager(状态管理节点)<br>motion_manager(移动运动管理)<br>monitor_manager(监控管理)<br>aggregator_node(诊断模块)<br>radiolink_ros_pkg(无线遥控)<br>radio_link_example(无线遥控)<br>simple_trajectory_server(追踪服务)

    %% 启动主launch管理节点
    auto_start->>launch_manage: /dynamic_launch(DynamicLaunch)
    %% 初始化关节节点
    auto_start->>xbot_state_manager: /ready_service(Trigger)
    launch_manage->>xbot.launch.py: 启动总launch
    auto_start->>simple_trajectory_server: /simple_trajectory(SimpleTrajectory)


    xbot.launch.py->>robot_state_publisher: robot_state_publisher(机器人状态发布<br>发布TF给rviz和mujoco)

    alt 开启GUI参数
        xbot.launch.py-->>RVIZ: 启动
    else 权限不足
        xbot.launch.py-->>RVIZ: 不启动
    end

    xbot.launch.py->>xbot_control: xbot_control(controller_manager<br>自动加载配置文件)
    xbot.launch.py->>simple_trajectory_server: simple_trajectory_server(追踪服务)

```

> xbot_controller启动流程
-----

```mermaid
sequenceDiagram
    %% 参与者定义
    participant xbot_control as xbot_control<br>(ros2_control_node)

    %% 注释
    Note over xbot_control: [ros2_control标准]<br>启动contrioller_manager<br>加载controller配置文件<br>加载硬件配置文件

    xbot_control->>controller_manager: 启动

    controller_manager->>ros_controllers: 根据controllers.yaml<br>加载controllers

    controller_manager->>hardware_interface: 根据urdf ros2_control<br>加载hardware_interface<br>xbot_hardware_interface

    hardware_interface->>xbot_engine: 初始化关节和ethercat

```

> hardware_interface插件启动流程
-----

```mermaid
sequenceDiagram
    %% 参与者定义
    participant hardware_interface as hardware_interface<br>(xbot_hardware_interface)

    hardware_interface->>xbot_engine: 1. 初始化xbot_engine类
    hardware_interface->>init_transmission: 2. 初始化init_transmission
    hardware_interface->>init_joint_limits: 3. 初始化init_joint_limits

    xbot_engine->>ethercat_int: ethercat初始化


```

>  xbot_state_manager ready流程
----

```mermaid
graph TD
    A["ready服务"] --> C[motion_manager/motion_request运动管理]
    A--> D[enjoind_able关节使能]




```

<!-- sequenceDiagram
    %% 参与者定义
    participant xbot_state_manager as xbot_state_manager
    participant xbot_control as xbot_control(ros2_control_node)

    %% 注释
    Note over xbot_state_manager: 状态 <br>[Init<br>IDLE<br>Ready<br>Active<br>Error<br>SHUTDOWN]

    %% 注释
    Note over xbot_state_manager: 服务 <br>[clean_error_service<br>ready_service,ota_service<br>shutdown_service<br>emergency_service<br>activate_service<br>deactivate_service<br>error_service<br>emergency_lifted_service] -->

# 启动流程

```mermaid

flowchart TD
    A[检查机器人硬件状态<br>（确认Ethercat连接、关节上电<br>绿色电源灯亮起）] --> B{选择模式}
    B -->|全身形态（带XHAND）| C[启动底层关节控制服务<br>/dynamic_launch<br>launch_mode: 'pos']
    B -->|全身形态（无XHAND）| C2[启动底层关节控制服务<br>/dynamic_launch<br>launch_mode: 'no_hand_pos']
    C & C2 --> D[初始化关节控制服务<br>/ready_service<br>（等待约20秒，接口返回成功）]
    D --> E[关节到标准起始位置<br>/simple_trajectory]
    E -->|使能算法控制| G1[使能算法控制<br>/activate_service]
    G1 --> H[发送关节控制命令<br>]
    H --> I[停止底层关节控制服务<br>/stop_launch]
```

# monitor_manager监控流程


```mermaid
classDiagram
    %% 核心接口和枚举
    class return_type {
        <<enumeration>>
        OK = 0
        ERROR = 1
    }

    class node_status {
        <<enumeration>>
        WAITING = 0
        RUNNING = 2
        STALE = 3
        TIMEOUT = 4
    }

    %% 基础接口类
    class MonitorBaseInterface {
        <<abstract>>
        -std::shared_ptr~LifecycleNode~ node_
        -std::string monitor_name_
        +MonitorBaseInterface()
        +~MonitorBaseInterface()
        +init(monitor_name: string, node: LifecycleNode::SharedPtr) return_type
        +configure(parameters: map~string,Parameter~) return_type
        +on_init()* return_type
        +diagnose(status: DiagnosticStatusWrapper&)* void
        +get_node() LifecycleNode::SharedPtr
        +get_name() string
    }

    %% 管理器类
    class MonitorManager {
        -ClassLoader~MonitorBaseInterface~ monitor_loader_
        -vector~shared_ptr~MonitorBaseInterface~~ monitors_
        -shared_ptr~Updater~ updater_
        -Executor::SharedPtr executor_
        +MonitorManager(robot_name: string, executor: Executor::SharedPtr)
        +~MonitorManager()
        +loadMonitors() void
        +unloadMonitors() void
        +on_configure(state: State&) CallbackReturn
        +on_activate(state: State&) CallbackReturn
        +on_deactivate(state: State&) CallbackReturn
        +on_cleanup(state: State&) CallbackReturn
    }

    %% 具体监视器实现类
    class BatteryMonitor {
        -BatteryState battery_state_
        -Subscription~BatteryState~::SharedPtr battery_state_sub_
        -double low_battery_threshold_
        +BatteryMonitor()
        +~BatteryMonitor()
        +configure(parameters: map~string,Parameter~) return_type
        +on_init() return_type
        +diagnose(status: DiagnosticStatusWrapper&) void
    }

    class NodeMonitor {
        -TimerBase::SharedPtr timer_
        -string node_name_
        -double timeout_
        -node_status node_status_
        -Subscription~DiagnosticArray~::SharedPtr diagnostic_sub_
        +NodeMonitor()
        +~NodeMonitor()
        +configure(parameters: map~string,Parameter~) return_type
        +on_init() return_type
        +diagnose(status: DiagnosticStatusWrapper&) void
        -diagnostic_callback(msg: DiagnosticArray::SharedPtr) void
    }

    class LifecycleNodeMonitor {
        -TimerBase::SharedPtr timer_
        -string node_name_
        -double timeout_
        -node_status node_status_
        -Subscription~DiagnosticArray~::SharedPtr diagnostic_sub_
        -Subscription~TransitionEvent~::SharedPtr transition_event_sub_
        +LifecycleNodeMonitor()
        +~LifecycleNodeMonitor()
        +configure(parameters: map~string,Parameter~) return_type
        +on_init() return_type
        +diagnose(status: DiagnosticStatusWrapper&) void
        -diagnostic_callback(msg: DiagnosticArray::SharedPtr) void
    }

    %% ROS2 框架类 (外部依赖)
    class LifecycleNode {
        <<ROS2>>
    }

    class Updater {
        <<diagnostic_updater>>
    }

    class ClassLoader {
        <<pluginlib>>
    }

    class Executor {
        <<ROS2>>
    }

    %% 继承关系
    MonitorBaseInterface <|-- BatteryMonitor
    MonitorBaseInterface <|-- NodeMonitor
    MonitorBaseInterface <|-- LifecycleNodeMonitor
    LifecycleNode <|-- MonitorManager

    %% 组合关系
    MonitorManager *-- MonitorBaseInterface : manages
    MonitorManager *-- ClassLoader : uses
    MonitorManager *-- Updater : uses
    MonitorManager *-- Executor : uses
    MonitorBaseInterface *-- LifecycleNode : contains

    %% 依赖关系
    MonitorBaseInterface ..> return_type : uses
    NodeMonitor ..> node_status : uses
    LifecycleNodeMonitor ..> node_status : uses

    %% 命名空间标注
    namespace monitor_interface {
        class MonitorBaseInterface
        class BatteryMonitor
        class NodeMonitor
        class LifecycleNodeMonitor
        class return_type
        class node_status
    }

    namespace monitor_manager {
        class MonitorManager
    }
```

# 启动流程

```mermaid
graph TD
    %% 系统启动层
    A[系统启动] --> B[Docker 容器启动]
    B --> C[auto_start.py 读取配置]
    C --> D{auto_start 开关}

    %% 配置管理
    C --> CONFIG[config.json<br/>配置文件<br/>• launch_mode<br/>• robot_type<br/>• hardware_type<br/>• use_mpc_controller<br/>• use_rl_controller]

    %% 自动启动流程
    D -->|true| E[自动启动流程]
    D -->|false| F[手动启动模式<br/>容器保持运行]

    %% 启动管理器
    E --> G[xbot_launch_manager<br/>动态启动管理器]
    G --> H[dynamic_launch 服务]

    %% 主要启动流程
    H --> I[启动 xbot.launch.py]
    I --> J[ros2_control_node<br/>控制器管理器]

    %% 硬件接口层
    J --> K[hardware_interface<br/>xbot_hardware_interface]
    K --> L[xbot_engine<br/>关节和EtherCAT初始化]

    %% 状态管理层
    I --> M[xbot_state_manager<br/>状态机管理]
    M --> N[状态转换服务<br/>• /ready_service<br/>• /activate_service<br/>• /emergency_service<br/>• /shutdown_service]

    %% 监控系统
    I --> O[monitor_manager<br/>监控管理器]
    O --> P[插件化监控器<br/>• BatteryMonitor<br/>• NodeMonitor<br/>• LifecycleNodeMonitor]
    P --> Q[diagnostic_aggregator<br/>诊断信息聚合]

    %% 运动控制层
    I --> R[motion_manager<br/>运动管理器]
    R --> S[simple_trajectory_server<br/>轨迹服务器]

    %% 控制器层
    J --> T[控制器加载<br/>• joint_state_broadcaster<br/>• position_controller<br/>• pd_controller]

    %% 状态发布
    I --> U[robot_state_publisher<br/>机器人状态发布<br/>TF变换]

    %% 外部接口
    I --> V[radiolink_ros_pkg<br/>无线遥控接口]

    %% 启动序列
    E --> AA[Step 1: /dynamic_launch]
    AA --> BB[Step 2: /ready_service<br/>关节准备]
    BB --> CC[Step 3: /simple_trajectory<br/>归零位置]
    CC --> DD[Step 4: /activate_service<br/>激活算法控制]

    %% 状态机状态
    M --> STATES[状态机状态<br/>INIT → IDLE → READY → ACTIVE<br/>ERROR ← → E_STOP<br/>SHUTDOWN ← OTA]

    %% 算法控制层
    DD --> EE{算法控制模式}
    EE -->|MPC上肢控制| FF[MPC 控制器<br/>上肢运动控制]
    EE -->|RL下肢控制| GG[RL 控制器<br/>下肢运动控制]
    EE -->|遥操作| HH[WebXR + Retarget<br/>遥操作系统]

    %% 应用层
    FF --> II[具体应用<br/>• 播放动作<br/>• 任务执行]
    GG --> JJ[下肢运动<br/>• 行走<br/>• 平衡]
    HH --> KK[远程控制<br/>• VR遥操作<br/>• 手势控制]

    %% 数据流
    L -.->|关节状态| U
    U -.->|TF变换| LL[RVIZ 可视化]
    P -.->|诊断信息| Q
    Q -.->|系统健康状态| M

    %% 配置文件系统
    CONFIG -.->|模式配置| G
    CONFIG -.->|硬件配置| K
    CONFIG -.->|控制器配置| J

    %% 日志系统
    G --> LOGS[日志系统<br/>/system_log/log/<br/>动态轮转]
    I --> LOGS

    %% 故障处理
    P --> ERROR_HANDLE[故障检测与处理<br/>• 电池监控<br/>• 节点监控<br/>• 生命周期监控]
    ERROR_HANDLE --> M

    %% 样式定义
    classDef startNode fill:#e1f5fe
    classDef configNode fill:#fff3e0
    classDef controlNode fill:#f3e5f5
    classDef hardwareNode fill:#e8f5e8
    classDef algorithmNode fill:#fff8e1
    classDef monitorNode fill:#fce4ec
    classDef stateNode fill:#e0f2f1

    class A,B,C,D,E,F startNode
    class CONFIG,G,H,I configNode
    class J,K,L,T,R,S controlNode
    class L,K hardwareNode
    class FF,GG,HH,EE algorithmNode
    class O,P,Q,ERROR_HANDLE monitorNode
    class M,N,STATES stateNode
```