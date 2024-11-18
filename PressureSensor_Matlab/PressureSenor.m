%% Basic Read Sensor Data
% This example shows how to retrieve data from a sensor channel
% 			
% Requires at least one Fluigent sensor (Flow Unit or IPS)
%
% <matlab:edit('Fluigent_SDK_BasicReadSensorData') Open this M File>

%% 创建 WebSocket 客户端对象  
% 库：https://github.com/jebej/MatlabWebSocket
% 导入SimpleClient类
import SimpleClient;
% 连接到服务器  
% ws_Client = SimpleClient('ws://localhost:3003');

% 创建一个定时器对象  (没用起来)
timerObj = timer('Name', 'myTimer','Period',2, 'TimerFcn', @myFunction, 'StartFcn', @start);  
  
% 启动定时器  
timerObj.StartFcn = @start;  
start(timerObj);

% 定义回调函数  
function start(~,~)  
    disp('Timer started!');  
    ws_Client = SimpleClient('ws://localhost:3003');
    while ~ws_Client.Status 
        fprintf('Failed to connect to the server. Trying again...\n');
        pause(1); % 暂停1秒后再次尝试连接
        ws_Client = SimpleClient('ws://localhost:3003'); 
    end
    % 向服务器确认websocekt建立连接
    ws_Client.send('sensor websocket connect');
end  
  
% 定义定时器触发时要调用的函数  
function myFunction(~,~)  
    disp('Executing myFunction...');  
    if(ws_Client.Status == false)   
        fprintf('Failed to connect to the server. Trying again...\n');
        pause(1); % 暂停1秒后再次尝试连接
        ws_Client = SimpleClient('ws://localhost:3003'); 
        % 向服务器确认websocekt建立连接
        ws_Client.send('sensor websocket connect');
    end
end  
  


% 之后由上位机发指令控制传感器的各种操作，传感器初始化，读取，关闭等函数都写在simpleclient的监听onTextMessage（）函数中

