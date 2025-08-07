
document.addEventListener('DOMContentLoaded', function() {
    const drawButton = document.getElementById('drawButton');
    const selectedNumbers = document.getElementById('selectedNumbers');
    const resultContainer = document.getElementById('result');
    
    drawButton.addEventListener('click', function() {
        // SweetAlert2로 확인 대화상자
        Swal.fire({
            title: '청소당번을 뽑으시겠습니까?',
            text: '1번부터 25번까지 중에서 5명을 무작위로 선택합니다!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네, 뽑겠습니다!',
            cancelButtonText: '취소',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-primary me-2',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                startDrawing();
            }
        });
    });
    
    function startDrawing() {
        // 로딩 알림
        Swal.fire({
            title: '추첨 중...',
            html: '<div class="loading-spinner"></div><br>청소당번을 선택하고 있습니다!',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            performDraw();
        });
    }
    
    function performDraw() {
        // 1부터 25까지의 숫자 배열 생성
        const numbers = [];
        for (let i = 1; i <= 25; i++) {
            numbers.push(i);
        }
        
        // 랜덤으로 5개 숫자 선택
        const selected = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            selected.push(numbers[randomIndex]);
            numbers.splice(randomIndex, 1);
        }
        
        // 선택된 숫자들을 정렬
        selected.sort((a, b) => a - b);
        
        // 결과 표시
        displayResults(selected);
    }
    
    function displayResults(numbers) {
        // 기존 결과 지우기
        selectedNumbers.innerHTML = '';
        resultContainer.classList.remove('d-none');
        
        // 성공 메시지
        Swal.fire({
            title: '추첨 완료!',
            text: '청소당번이 선정되었습니다!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        
        // 애니메이션과 함께 숫자 표시
        numbers.forEach((number, index) => {
            setTimeout(() => {
                const numberElement = document.createElement('div');
                numberElement.className = 'number-badge';
                numberElement.textContent = number + '번';
                
                // 마지막 숫자에는 특별한 효과
                if (index === numbers.length - 1) {
                    numberElement.classList.add('pulse-animation');
                }
                
                selectedNumbers.appendChild(numberElement);
                
                // 사운드 효과 (선택적)
                playNotificationSound();
                
            }, index * 300);
        });
        
        // 모든 숫자가 표시된 후 축하 메시지
        setTimeout(() => {
            showCelebration(numbers);
        }, numbers.length * 300 + 500);
    }
    
    function showCelebration(numbers) {
        const numbersText = numbers.map(n => n + '번').join(', ');
        
        Swal.fire({
            title: '🎉 축하합니다! 🎉',
            html: `
                <div class="mb-3">
                    <h4 class="text-primary">선정된 청소당번</h4>
                    <div class="alert alert-info">
                        <strong>${numbersText}</strong>
                    </div>
                </div>
                <p class="text-muted">수고하세요! 깨끗한 교실을 만들어주세요! ✨</p>
            `,
            icon: 'success',
            confirmButtonText: '다시 뽑기',
            showCancelButton: true,
            cancelButtonText: '완료',
            customClass: {
                confirmButton: 'btn btn-primary me-2',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                // 결과 숨기고 다시 뽑기 준비
                resultContainer.classList.add('d-none');
                selectedNumbers.innerHTML = '';
            }
        });
    }
    
    function playNotificationSound() {
        // 브라우저 지원 확인 후 오디오 재생 (선택적)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjZmAzSO0fdSDw/');
            audio.volume = 0.1;
            audio.play().catch(() => {
                // 오디오 재생 실패시 무시
            });
        } catch (e) {
            // 오디오 생성 실패시 무시
        }
    }
});
