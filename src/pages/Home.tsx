import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';


const Home: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Job categories for animated display
  const popularSearches = ['Разработчик', 'Менеджер', 'Дизайнер', 'Аналитик', 'Маркетолог'];
  
  // Platform statistics
  const stats = [
    { value: '1,000,000+', label: 'Вакансий' },
    { value: '50,000+', label: 'Компаний' },
    { value: '10M+', label: 'Соискателей' },
    { value: '99%', label: 'Успешных поисков' },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        ease: [0.42, 0, 0.58, 1], // cubic-bezier for easeInOut
        repeat: Infinity,
      }
    }
  };

  return (
    <main className="min-h-[100vh]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white bg-opacity-5"
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 + "%",
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 + "%",
                scale: Math.random() * 0.5 + 0.5,
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Main headline with typing effect */}
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Найдите работу <span className="text-yellow-400">мечты</span> вместе с нами
            </motion.h1>
            
            <motion.div variants={itemVariants} className="mb-8 text-xl md:text-2xl text-blue-100">
              <ReactTyped
                strings={[
                  'Сотни новых вакансий каждый день',
                  'Работа в ведущих компаниях',
                  'Удаленная работа по всему миру',
                  'Карьерный рост и развитие'
                ]}
                typeSpeed={40}
                backSpeed={30}
                loop
              />
            </motion.div>
            
            {/* Search bar with animation */}
            <motion.div 
              variants={itemVariants}
              className="relative max-w-2xl mx-auto mb-12"
            >
              <motion.div
                animate={{
                  scale: isInputFocused ? 1.02 : 1,
                  boxShadow: isInputFocused
                    ? "0 10px 25px rgba(0, 0, 0, 0.2)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex rounded-full bg-white"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Поиск вакансий, например: JavaScript разработчик"
                  className="w-full px-6 py-4 rounded-l-full text-gray-800 focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-r-full transition-colors duration-300">
                  Найти
                </button>
              </motion.div>
              
              {/* Popular searches */}
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-blue-200">Популярные запросы:</span>
                {popularSearches.map((term, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 px-3 py-1 rounded-full transition-all"
                    onClick={() => setSearchInput(term)}
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* Statistics */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-4"
                  whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <motion.p 
                    className="text-2xl md:text-3xl font-bold text-yellow-300"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm md:text-base">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/headhunter">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
                >
                  Найти вакансии
                </motion.button>
              </Link>
              <Link to="/my-resume">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
                >
                  Загрузить резюме
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#f8fafc"
              fillOpacity="1"
              d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,224C840,245,960,267,1080,250.7C1200,235,1320,181,1380,154.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Почему стоит искать работу с нами?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💼",
                title: "Лучшие компании",
                description: "Доступ к вакансиям от ведущих компаний и стартапов России и мира"
              },
              {
                icon: "🚀",
                title: "Быстрый поиск",
                description: "Умный алгоритм подбирает вакансии, соответствующие вашим навыкам"
              },
              {
                icon: "📈",
                title: "Карьерный рост",
                description: "Возможности для развития и роста в любой сфере деятельности"
              },
              {
                icon: "🌐",
                title: "Удаленная работа",
                description: "Большой выбор вакансий с удаленным форматом работы"
              },
              {
                icon: "💰",
                title: "Достойная оплата",
                description: "Прозрачная информация о зарплатах и компенсациях"
              },
              {
                icon: "🛡️",
                title: "Проверенные работодатели",
                description: "Мы сотрудничаем только с надежными компаниями"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <motion.div 
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  className="text-4xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call-to-action Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы начать новую карьеру?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Создайте профиль прямо сейчас и получите доступ к тысячам вакансий от лучших работодателей
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
          >
            Начать бесплатно
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
};

export default Home;