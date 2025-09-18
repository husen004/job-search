import React, { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'account', icon: '👤', title: 'Аккаунт', color: 'bg-blue-100 text-blue-800' },
  { id: 'resume', icon: '📄', title: 'Резюме', color: 'bg-green-100 text-green-800' },
  { id: 'search', icon: '🔍', title: 'Поиск вакансий', color: 'bg-purple-100 text-purple-800' },
  { id: 'applications', icon: '✉️', title: 'Отклики', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'employers', icon: '🏢', title: 'Работодателям', color: 'bg-red-100 text-red-800' },
  { id: 'technical', icon: '🔧', title: 'Технические проблемы', color: 'bg-gray-100 text-gray-800' },
];

 const faqItems = [
    {
      question: 'Как создать аккаунт на платформе?',
      answer: 'Для создания аккаунта нажмите кнопку "Регистрация" в правом верхнем углу экрана. Заполните необходимую информацию и подтвердите свой email. После этого вы сможете войти в систему, используя свои учетные данные.',
      category: 'account'
    },
    {
      question: 'Как загрузить резюме на сайт?',
      answer: 'Чтобы загрузить резюме, перейдите в раздел "Мои резюме" в личном кабинете. Нажмите кнопку "Создать резюме" или "Загрузить файл". Вы можете загрузить документ в формате PDF или заполнить онлайн-форму с вашими данными.',
      category: 'resume'
    },
    {
      question: 'Как отфильтровать вакансии по зарплате?',
      answer: 'При поиске вакансий используйте фильтр "Зарплата" в левой части экрана. Вы можете указать минимальную ожидаемую зарплату или выбрать диапазон. Также можно включить показ только тех вакансий, где указана зарплата.',
      category: 'search'
    },
    {
      question: 'Как отслеживать статус моих откликов?',
      answer: 'Все ваши отклики на вакансии доступны в разделе "Мои отклики" в личном кабинете. Здесь вы можете видеть статус каждого отклика: просмотрен, приглашение на собеседование или отказ.',
      category: 'applications'
    },
    {
      question: 'Как разместить вакансию на сайте?',
      answer: 'Для размещения вакансии необходимо зарегистрироваться как работодатель. После этого в личном кабинете будет доступна кнопка "Разместить вакансию". Заполните все необходимые поля и опубликуйте вакансию.',
      category: 'employers'
    },
    {
      question: 'Что делать, если сайт не работает?',
      answer: 'Если у вас возникли проблемы с доступом к сайту, попробуйте очистить кэш браузера или использовать другой браузер. Если проблема не решена, свяжитесь с нашей технической поддержкой через форму обратной связи.',
      category: 'technical'
    },
    {
      question: 'Как изменить настройки уведомлений?',
      answer: 'Для изменения настроек уведомлений перейдите в раздел "Настройки" в вашем личном кабинете. В подразделе "Уведомления" вы можете включить или отключить различные типы уведомлений: email-рассылки, push-уведомления и SMS.',
      category: 'account'
    },
    {
      question: 'Как удалить мой аккаунт?',
      answer: 'Для удаления аккаунта перейдите в "Настройки" > "Управление аккаунтом" и нажмите на кнопку "Удалить аккаунт". Пожалуйста, обратите внимание, что это действие нельзя отменить, и все ваши данные будут удалены безвозвратно.',
      category: 'account'
    },
  ];

const Support: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
 
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Filter FAQ items by search and category
  const filteredFaqs = faqItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle FAQ item expansion
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="min-h-[100vh] bg-slate-50">
      {/* Hero section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4"
          >
            Центр поддержки
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto mb-8"
          >
            Нашли вопрос или нужна помощь? Мы здесь, чтобы помочь вам в поиске работы мечты.
          </motion.p>
          
          {/* Search bar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск ответов на вопросы..."
              className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg text-lg"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Категории поддержки</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded-lg p-4 text-center transition-all ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'bg-white shadow hover:shadow-md'
              }`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-xl mx-auto mb-3`}>
                {category.icon}
              </div>
              <h3 className="font-medium">{category.title}</h3>
            </motion.div>
          ))}
        </motion.div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Часто задаваемые вопросы</h2>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span>Сбросить фильтр</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {filteredFaqs.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {filteredFaqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="mb-4"
                >
                  <motion.button
                    initial={false}
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left bg-white p-4 rounded-lg shadow hover:shadow-md transition-all flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </motion.button>
                  
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: expandedFaq === index ? 'auto' : 0,
                      opacity: expandedFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-blue-50 rounded-b-lg"
                  >
                    <div className="p-4 text-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-lg shadow"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Ничего не найдено</h3>
              <p className="text-gray-600">
                По вашему запросу не найдено результатов. Попробуйте изменить поисковый запрос или категорию.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Остались вопросы?</h2>
              <p className="text-gray-600">Свяжитесь с нами напрямую, и мы ответим в течение 24 часов</p>
            </div>
            
            <form className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Ваше имя</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Иван Иванов"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email адрес</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="subject">Тема</label>
                <select
                  id="subject"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите тему обращения</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                  <option value="other">Другое</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="message">Сообщение</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Опишите вашу проблему или вопрос подробно..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="ml-2 text-gray-700">Я согласен на обработку персональных данных</span>
                </label>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                type="submit"
              >
                Отправить сообщение
              </motion.button>
            </form>
          </motion.div>
        </div>
        
        {/* Additional Help Options */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Chat Support */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Чат с поддержкой</h3>
            <p className="text-gray-600 mb-4">Общайтесь с командой поддержки в режиме реального времени</p>
            <button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition-colors">
              Начать чат
            </button>
          </div>
          
          {/* Email Support */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg border border-green-100 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Email поддержка</h3>
            <p className="text-gray-600 mb-4">Напишите нам на почту для решения сложных вопросов</p>
            <a href="mailto:support@jobsearch.com" className="bg-white border border-green-200 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded transition-colors inline-block">
              support@jobsearch.com
            </a>
          </div>
          
          {/* Knowledge Base */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">База знаний</h3>
            <p className="text-gray-600 mb-4">Изучите нашу подробную документацию и руководства</p>
            <button className="bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded transition-colors">
              Открыть базу знаний
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;