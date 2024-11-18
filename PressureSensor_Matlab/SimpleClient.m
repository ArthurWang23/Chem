classdef SimpleClient < WebSocketClient
    %CLIENT Summary of this class goes here
    %   Detailed explanation goes here
    
    properties
        fgt_status = 0;
    end
    
    methods
        function obj = SimpleClient(varargin)
            %Constructor
            obj@WebSocketClient(varargin{:});
        end
    end
    
    methods (Access = protected)
        function onOpen(obj,message)
            % This function simply displays the message received
            fprintf('%s\n',message);
        end
        
        function onTextMessage(obj,message)
            % This function simply displays the message received
            fprintf('Message received:\n%s\n',message);
            % websocket建立连接后，上位机发送传感器初始化信号
            if(message == "init")
              %% Initialize the session
                % This step is optional, if not called session will be automatically created
                fgt_init
                
              %% Get information about sensors and read them
                [sensorInfoArray, sensorTypeArray] = fgt_get_sensorChannelsInfo;
                % 经电脑重启与USB插拔测试，只要两个USB压力传感器同时插在电脑上运行脚本
                % sensorInfoArray 里面第一个设备一定是 SN=10774（硬件上有标注） indexID=1.3863e+09
                % 第二个设备一定是SN = 10792（硬件上有标注） indexID=1.3864e+09
                for i=1:numel(sensorInfoArray)
                    % SDK indices start at 0
                    sensorIndex = i-1;
                    fprintf('Sensor channel info at index: %d\n', sensorIndex);
                    disp(sensorInfoArray(i));
                    fprintf('Sensor type: %s\n', fgt_SENSOR_TYPE(sensorTypeArray(i)));
                end
                % Get measurement unit
                unit = fgt_get_sensorUnit(0); %两个设备同款，单位相同
                % Get sensor range
                [minSensor, maxSensor] = fgt_get_sensorRange(0);
                fprintf('Range %.2f to %.2f %s\n', minSensor, maxSensor, unit);
                
                obj.send('sensor init finish');
                fprintf('fgt sensors init finish\n');
                
            end
            if(message == "start")
                obj.fgt_status = 1;
                % Read the sensor repeatedly
                while(obj.fgt_status == 1 && obj.Status == true)
                    % Get measurement unit
                    unit = fgt_get_sensorUnit(0); %两个设备同款，单位相同
                    % 获取SN=10774设备的值，只要SN不变（也不会变）,fgt_get_sensorValue(0)就是获取本设备的值
                    measurement1 = fgt_get_sensorValue(0);
                    % 获取SN=10792设备的值，只要SN不变（也不会变）,fgt_get_sensorValue(1)就是获取本设备的值
                    measurement2 = fgt_get_sensorValue(1);
                    % ws 发送
                    str1 = sprintf('A%.1f,B%.1f',measurement1,measurement2);
                    obj.send(str1);
                    fprintf('Measured sensor1 %.1f %s\nMeasured sensor2 %.1f %s\n', measurement1, unit, measurement2, unit);
                    pause(1);
                    
%                     str2 = sprintf('B%.2f',measurement2);
%                     obj.send(str2);
%                     fprintf('Measured sensor2 %.2f %s\n', measurement2, unit);
%                     pause(0.5);
                end

            end
            if(message == "stop")
                obj.fgt_status = 2;
            end
            if(message == "close")
              %% Close the session
                obj.fgt_status = 0;
                fgt_close
            end
        end
        
        function onBinaryMessage(obj,bytearray)
            % This function simply displays the message received
            fprintf('Binary message received:\n');
            fprintf('Array length: %d\n',length(bytearray));
        end
        
        function onError(obj,message)
            % This function simply displays the message received
            fprintf('Error: %s\n',message);
        end
        
        function onClose(obj,message)
            % This function simply displays the message received
            fprintf('%s\n',message);
        end
    end
end


