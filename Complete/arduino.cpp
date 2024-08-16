#include <SoftwareSerial.h>

#include <Wire.h>

SoftwareSerial soft(2,3);

int16_t dist1;
int16_t dist2;

class KalmanFilter {
public:
    KalmanFilter(float process_noise, float measurement_noise, float estimated_error, float initial_value) {
        Q = process_noise;
        R = measurement_noise;
        P = estimated_error;
        X = initial_value;
    }

float update(float measurement) {
    // Prediction update
    P = P + Q;

    // Measurement update
    K = P / (P + R);
    X = X + K * (measurement - X);
    P = (1 - K) * P;

    return X;
}
private:
    float Q; // Process noise covariance
    float R; // Measurement noise covariance
    float P; // Estimation error covariance
    float K; // Kalman gain
    float X; // Value
};

KalmanFilter kf1(0.1, 0.1, 0.1, 0); // 앵커 0 (정확한 값)
KalmanFilter kf2(0.1, 0.1, 0.1, 0); // 앵커 1 (덜 정확한 값)

void setup()
{
  Serial.begin(115200);
  soft.begin(115200);
}

void loop()
{
  if ( soft.available() >= 5 )
  {
    int id = soft.read();
    if ( id == 20 )
    {
      dist1 = soft.read();
      dist1 = dist1 | ( soft.read() << 8 );
      dist2 = soft.read();
      dist2 = dist2 | ( soft.read() << 8 );
      //Serial.print(dist1);
      //Serial.print(",");
      //Serial.print(dist2);
      //Serial.println("");
      // 칼만 필터로 필터링
      float filteredDistance1 = kf1.update(dist1);
      float filteredDistance2 = kf2.update(dist2);

  Serial.print(filteredDistance1);
  Serial.print(", ");
  Serial.println(filteredDistance2*adValue);
}
  }
}