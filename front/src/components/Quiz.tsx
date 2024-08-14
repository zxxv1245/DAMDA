import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,Image } from 'react-native';
import { colors } from '../constants/color';
import CustomButton from './CustomButton';


interface Question {
  question: string;
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    question: 'C103팀의 팀명은?',
    options: ['췩췩 스프레이', '촥촥 스프레이', '찰싹찰싹 스프레이', '칙칙 스프레이'],
    answer: '췩췩 스프레이',
  },
  {
    question: 'C103팀의 팀장은 누구일까요?',
    options: ['주현민', '이종하', '이택규', '윤의웅'],
    answer: '이택규',
  },
  {
    question: 'C103팀에서 제일 귀여운 사람은?',
    options: ['이택규', '윤의웅', '이주호', '주현민'],
    answer: '이주호',
  },
  {
    question: 'C103팀의 백엔드는 누구일까요?',
    options: ['이택규', '천요성', '주현민', '이종하'],
    answer: '천요성',
  },
  {
    question: 'C103팀의 서비스명은 무엇일까요?',
    options: ['담지마', '담다', '담을까?', '담을래?'],
    answer: '담다',
  },
  {
    question: '왜 췩췩 스프레이일까요?',
    options: ['갱스터라', '귀여워서', '남자만 있어서', '잘생겨서'],
    answer: '남자만 있어서',
  },
  {
    question: "'담다'의 기능이 아닌 것은 무엇일까요?",
    options: ['트레킹', 'QR인식', '사물 인식', '플라잉'],
    answer: '플라잉',
  },
  {
    question: "C103팀에서 가장 잘생긴 사람은 누구일까요?",
    options: ['이종하', '이택규', '윤의웅', '천요성'],
    answer: '이종하',
  },
  {
    question: "C103팀에 흡연자는 몇 명일까요?",
    options: ['2명', '3명', '4명', '5명'],
    answer: '3명',
  },
  {
    question: "C103팀의 막내는 누구일까요?",
    options: ['천요성', '주현민', '이주호', '윤의웅'],
    answer: '윤의웅',
  },
];

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const QuizGame: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setShuffledQuestions(shuffleArray([...questions])); 
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (selectedOption: string) => {
    if (gameOver || loading) return;

    setLoading(true);
    setTimeout(() => {
      if (selectedOption === shuffledQuestions[currentQuestionIndex].answer) {
        setScore(score + 1);
      }

      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setGameOver(true);
      }
      setLoading(false);
    }, 500);
  };

  const resetGame = () => {
    setShuffledQuestions(shuffleArray([...questions]));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.scoreText}>점수 : {score}</Text>
          <CustomButton
            label="다시하기"
            variant="outlined"
            onPress={resetGame}
          />
        </View>
      ) : (
        <>
          <Text style={styles.timerText}>남은 시간 : {timeLeft}s</Text>
          <Image source={require('../assets/quiz.png')} style = {styles.QuizImg}/>
          <Text style={styles.questionText}>{shuffledQuestions[currentQuestionIndex]?.question}</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.BLUE_500} />
          ) : (
            shuffledQuestions[currentQuestionIndex]?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionButtonText}>{option}</Text>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.WHITE,
  },
  timerText: {
    fontSize: 28,
    marginBottom: 20,
    color: colors.BLACK,
  },
  questionText: {
    fontSize: 25,
    marginBottom: 20,
    color: colors.BLACK,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: colors.GRAY_200,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 18,
    color: colors.BLACK,
  },
  gameOverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    color: colors.BLACK,
    marginBottom: 20,
  },
  QuizImg : { 
    width : 200,
    height : 200,
  }
});

export default QuizGame;
