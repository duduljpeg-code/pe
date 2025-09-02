        class Calculator {
            constructor() {
                this.display = document.getElementById('display');
                this.history = document.getElementById('history');
                this.memoryIndicator = document.getElementById('memoryIndicator');
                this.currentInput = '0';
                this.operator = null;
                this.previousInput = null;
                this.waitingForOperand = false;
                this.memory = 0;
                this.calculationHistory = '';
                this.updateDisplay();
                this.clearActiveOperators();
            }

            updateDisplay() {
                // Format large numbers
                let displayValue = this.currentInput;
                if (displayValue.length > 12) {
                    const num = parseFloat(displayValue);
                    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
                        displayValue = num.toExponential(6);
                    } else {
                        displayValue = num.toPrecision(12).replace(/\.?0+$/, '');
                    }
                }
                
                this.display.value = displayValue;
                this.display.classList.remove('error');
                
                // Update memory indicator
                this.memoryIndicator.style.display = this.memory !== 0 ? 'block' : 'none';
            }

            updateHistory(text) {
                this.history.textContent = text;
            }

            clearActiveOperators() {
                document.querySelectorAll('.btn-operator').forEach(btn => {
                    btn.classList.remove('active');
                });
            }

            setActiveOperator(op) {
                this.clearActiveOperators();
                const operatorMap = {
                    '+': 'add',
                    '-': 'subtract', 
                    '*': 'multiply',
                    '/': 'divide'
                };
                const elementId = operatorMap[op];
                if (elementId) {
                    document.getElementById(elementId).classList.add('active');
                }
            }

            inputNumber(num) {
                if (this.waitingForOperand) {
                    this.currentInput = num;
                    this.waitingForOperand = false;
                } else {
                    this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
                }
                this.updateDisplay();
            }

            inputDecimal() {
                if (this.waitingForOperand) {
                    this.currentInput = '0.';
                    this.waitingForOperand = false;
                } else if (this.currentInput.indexOf('.') === -1) {
                    this.currentInput += '.';
                }
                this.updateDisplay();
            }

            inputOperator(nextOperator) {
                const inputValue = parseFloat(this.currentInput);

                if (this.previousInput === null) {
                    this.previousInput = inputValue;
                } else if (this.operator) {
                    const currentValue = this.previousInput || 0;
                    const newValue = this.performCalculation(this.operator, currentValue, inputValue);

                    this.currentInput = String(newValue);
                    this.previousInput = newValue;
                    this.updateDisplay();
                }

                this.waitingForOperand = true;
                this.operator = nextOperator;
                this.setActiveOperator(nextOperator);
                
                // Update history
                const operatorSymbol = this.getOperatorSymbol(nextOperator);
                this.calculationHistory = `${this.previousInput} ${operatorSymbol}`;
                this.updateHistory(this.calculationHistory);
            }

            getOperatorSymbol(operator) {
                const symbols = {
                    '+': '+',
                    '-': '-',
                    '*': '×',
                    '/': '÷'
                };
                return symbols[operator] || operator;
            }

            performCalculation(operator, firstOperand, secondOperand) {
                switch (operator) {
                    case '+':
                        return firstOperand + secondOperand;
                    case '-':
                        return firstOperand - secondOperand;
                    case '*':
                        return firstOperand * secondOperand;
                    case '/':
                        if (secondOperand === 0) {
                            throw new Error('Cannot divide by zero');
                        }
                        return firstOperand / secondOperand;
                    default:
                        return secondOperand;
                }
            }

            calculate() {
                const inputValue = parseFloat(this.currentInput);

                if (this.previousInput !== null && this.operator) {
                    try {
                        const result = this.performCalculation(this.operator, this.previousInput, inputValue);
                        
                        // Update history with complete calculation
                        const operatorSymbol = this.getOperatorSymbol(this.operator);
                        this.updateHistory(`${this.previousInput} ${operatorSymbol} ${inputValue} =`);
                        
                        this.currentInput = String(result);
                        this.previousInput = null;
                        this.operator = null;
                        this.waitingForOperand = true;
                        this.clearActiveOperators();
                        this.updateDisplay();
                    } catch (error) {
                        this.showError(error.message);
                    }
                }
            }

            clearAll() {
                this.currentInput = '0';
                this.previousInput = null;
                this.operator = null;
                this.waitingForOperand = false;
                this.calculationHistory = '';
                this.clearActiveOperators();
                this.updateHistory('');
                this.updateDisplay();
            }

            clearEntry() {
                this.currentInput = '0';
                this.updateDisplay();
            }

            deleteLast() {
                if (this.currentInput.length > 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                } else {
                    this.currentInput = '0';
                }
                this.updateDisplay();
            }

            // Memory functions
            addToMemory() {
                this.memory += parseFloat(this.currentInput);
                this.updateDisplay();
            }

            subtractFromMemory() {
                this.memory -= parseFloat(this.currentInput);
                this.updateDisplay();
            }

            recallMemory() {
                this.currentInput = String(this.memory);
                this.waitingForOperand = true;
                this.updateDisplay();
            }

            clearMemory() {
                this.memory = 0;
                this.updateDisplay();
            }

            showError(message) {
                this.display.value = message;
                this.display.classList.add('error');
                setTimeout(() => {
                    this.clearAll();
                }, 2000);
            }
        }

        // Initialize calculator
        let calc = new Calculator();

        // Global functions for button clicks
        function inputNumber(num) {
            calc.inputNumber(num);
        }

        function inputOperator(op) {
            calc.inputOperator(op);
        }

        function inputDecimal() {
            calc.inputDecimal();
        }

        function calculate() {
            calc.calculate();
        }

        function clearAll() {
            calc.clearAll();
        }

        function clearEntry() {
            calc.clearEntry();
        }

        function deleteLast() {
            calc.deleteLast();
        }

        function addToMemory() {
            calc.addToMemory();
        }

        function subtractFromMemory() {
            calc.subtractFromMemory();
        }

        function recallMemory() {
            calc.recallMemory();
        }

        function clearMemory() {
            calc.clearMemory();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevent default behavior for calculator keys
            if (/[0-9+\-*/=.cC]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
                event.preventDefault();
            }

            // Numbers
            if (/[0-9]/.test(key)) {
                inputNumber(key);
            }
            
            // Operators
            if (key === '+') inputOperator('+');
            if (key === '-') inputOperator('-');
            if (key === '*') inputOperator('*');
            if (key === '/') inputOperator('/');
            
            // Special keys
            if (key === '.' || key === ',') inputDecimal();
            if (key === 'Enter' || key === '=') calculate();
            if (key === 'Escape' || key === 'c' || key === 'C') clearAll();
            if (key === 'Backspace') deleteLast();
        });

        // Add visual feedback for button presses
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transform = '';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        console.log('Calculator initialized successfully!');
        console.log('Keyboard shortcuts:');
        console.log('- Numbers: 0-9');
        console.log('- Operators: +, -, *, /');
        console.log('- Decimal: . or ,');
        console.log('- Calculate: Enter or =');
        console.log('- Clear: Escape or C');
        console.log('- Delete: Backspace');
