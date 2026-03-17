import http from '@/utils/request';
import config from '@/config';
import { tansParams } from '@/utils/common';

export default {
	licenceBorrowing: {
		getLicenceBorrowingList:{
			url: `/get/office/getLicenceBorrowingList`,
			name: "获取证照出借记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		createBpmByLicenceRecordRule:{
			url: `/set/office/createBpmByLicenceRecordRule`,
			name: "发起出借申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertLicenceBorrowing: {
			url: `/set/office/insertLicenceBorrowing`,
			name: "添加出借记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteLicenceBorrowing: {
			url: `/set/office/deleteLicenceBorrowing`,
			name: "删除出借记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateLicenceBorrowing: {
			url: `/set/office/updateLicenceBorrowing`,
			name: "更新出借记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteLicenceBorrowingByIds: {
			url: `/set/office/deleteLicenceBorrowingByIds`,
			name: "批量删除出借记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
	},
	licenceRecord: {
		getLicenceRecordListForSelect:{
			url: `/get/office/getLicenceRecordListForSelect`,
			name: "获取单位证照备选列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getLicenceRecordList:{
			url: `/get/office/getLicenceRecordList`,
			name: "获取证书列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertLicenceRecord: {
			url: `/set/office/insertLicenceRecord`,
			name: "添加证照",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteLicenceRecord: {
			url: `/set/office/deleteLicenceRecord`,
			name: "删除证照",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateLicenceRecord: {
			url: `/set/office/updateLicenceRecord`,
			name: "更新证照",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteLicenceRecordByIds: {
			url: `/set/office/deleteLicenceRecordByIds`,
			name: "批量删除证照",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
	},
	licenceType: {
		getLicenceTypeList:{
			url: `/get/office/getLicenceTypeList`,
			name: "获取分类列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getLicenceTypeTree: {
			url: `/get/office/getLicenceTypeTree`,
			name: "获取分类树型结构",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertLicenceType: {
			url: `/set/office/insertLicenceType`,
			name: "添加证照类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteLicenceType: {
			url: `/set/office/deleteLicenceType`,
			name: "删除证照类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateLicenceType: {
			url: `/set/office/updateLicenceType`,
			name: "更新证照类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteLicenceTypeByIds: {
			url: `/set/office/deleteLicenceTypeByIds`,
			name: "批量删除证照类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
	},
	duty: {
		getDutyRecordById: {
			url: `/get/office/getDutyRecordById`,
			name: "获取值班记录详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDutyListBySortId: {
			url: `/get/office/getDutyListBySortId`,
			name: "获取当前值班列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDutyRecordListForApproval: {
			url: `/get/office/getDutyRecordListForApproval`,
			name: "获取值班待审批列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertDutyRecord: {
			url: `/set/office/insertDutyRecord`,
			name: "添加值班记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteDutyRecord: {
			url: `/set/office/deleteDutyRecord`,
			name: "删除值班记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateDutyRecord: {
			url: `/set/office/updateDutyRecord`,
			name: "更新值班记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		approvalDutyRecord: {
			url: `/set/office/approvalDutyRecord`,
			name: "审批值班记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getDutyRecordList: {
			url: `/get/office/getDutyRecordList`,
			name: "获取值班列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertDutySort: {
			url: `/set/office/insertDutySort`,
			name: "添加值班分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteDutySort: {
			url: `/set/office/deleteDutySort`,
			name: "删除值班分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateDutySort: {
			url: `/set/office/updateDutySort`,
			name: "更新值班分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getDutySortList: {
			url: `/get/office/getDutySortList`,
			name: "获取值办分类",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getDutySortListForSelect: {
			url: `/get/office/getDutySortListForSelect`,
			name: "获取已启用的分类列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	exam: {
		getExamGradeById: {
			url: `/get/office/getExamGradeById`,
			name: "获取考试成绩",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getExamTestListForSelect: {
			url: `/get/office/getExamTestListForSelect`,
			name: "获取考试列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getExamGradeOldList: {
			url: `/get/office/getExamGradeOldList`,
			name: "获取考试成绩列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getExamGradeList: {
			url: `/get/office/getExamGradeList`,
			name: "获取考试成绩列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		approvalExamTest: {
			url: `/set/office/approvalExamTest`,
			name: "试卷判卷",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		addExamGrade: {
			url: `/set/office/addExamGrade`,
			name: "提交考试成绩",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamGrade: {
			url: `/set/office/deleteExamGrade`,
			name: "删除考试成绩",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamGrade: {
			url: `/set/office/updateExamGrade`,
			name: "更新考试成绩",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getExamTestById: {
			url: `/get/office/getExamTestById`,
			name: "获取试卷详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getExamQuestionListById: {
			url: `/get/office/getExamQuestionListById`,
			name: "获取试题列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyExamTestList: {
			url: `/get/office/getMyExamTestList`,
			name: "获取试卷列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getExamQuestionRecordForSelect: {
			url: `/get/office/getExamQuestionRecordForSelect`,
			name: "获取试卷列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getExamTestManageList: {
			url: `/get/office/getExamTestManageList`,
			name: "获取试卷管理列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertExamTest: {
			url: `/set/office/insertExamTest`,
			name: "添加试题测试",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamTest: {
			url: `/set/office/deleteExamTest`,
			name: "删除试题测试",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamTestByIds: {
			url: `/set/office/deleteExamTestByIds`,
			name: "批量删除试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamTest: {
			url: `/set/office/updateExamTest`,
			name: "更新试题测试",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamTestStatus: {
			url: `/set/office/updateExamTestStatus`,
			name: "更新试题测试",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getExamQuestionRecordList: {
			url: `/get/office/getExamQuestionRecordList`,
			name: "获取试卷列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertExamQuestionRecord: {
			url: `/set/office/insertExamQuestionRecord`,
			name: "添加试卷试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamQuestionRecord: {
			url: `/set/office/deleteExamQuestionRecord`,
			name: "删除试卷试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamQuestionRecord: {
			url: `/set/office/updateExamQuestionRecord`,
			name: "更新试卷试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertExamTestSort: {
			url: `/set/office/insertExamTestSort`,
			name: "添加考试类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamTestSort: {
			url: `/set/office/deleteExamTestSort`,
			name: "删除考试类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamTestSort: {
			url: `/set/office/updateExamTestSort`,
			name: "更新试题分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getExamTestSortTree: {
			url: `/get/office/getExamTestSortTree`,
			name: "获取试题分类树结构",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertExamQuestions: {
			url: `/set/office/insertExamQuestions`,
			name: "添加试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamQuestions: {
			url: `/set/office/deleteExamQuestions`,
			name: "删除试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamQuestionsByIds: {
			url: `/set/office/deleteExamQuestionsByIds`,
			name: "批量删除试题",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamQuestions: {
			url: `/set/office/updateExamQuestions`,
			name: "更新试题内容",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getExamQuestionsListBySortId: {
			url: `/get/office/getExamQuestionsListBySortId`,
			name: "按分类获取试题列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getExamSortTree: {
			url: `/get/office/getExamSortTree`,
			name: "获取试题分类树结构",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertExamSort: {
			url: `/set/office/insertExamSort`,
			name: "添加试题类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteExamSort: {
			url: `/set/office/deleteExamSort`,
			name: "删除试题类型",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateExamSort: {
			url: `/set/office/updateExamSort`,
			name: "更新试题分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getMyExamTestById: {
			url: `/get/office/getMyExamTestById`,
			name: "获取考试详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	task: {
		getMyTaskListForDesk: {
			url: `/get/office/getMyTaskListForDesk`,
			name: "获取桌面个人任务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getTaskProcessInfo: {
			url: `/get/office/getTaskProcessInfo`,
			name: "获取处理事件详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertTaskProcess: {
			url: `/set/office/insertTaskProcess`,
			name: "添加子任务处理结果",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteTaskProcess: {
			url: `/set/office/deleteTaskProcess`,
			name: "删除子任务处理结果",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateTaskProcess: {
			url: `/set/office/updateTaskProcess`,
			name: "修改子任务的处理过程",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getGanttInfoByTaskId: {
			url: `/get/office/getGanttInfoByTaskId`,
			name: "获取Gantt详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getTaskById: {
			url: `/get/office/getTaskById`,
			name: "获取任务详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyTaskWorkList: {
			url: `/get/office/getMyTaskWorkList`,
			name: "获取我的任务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyTaskWorkListForApp: {
			url: `/get/office/getMyTaskWorkListForApp`,
			name: "获取我的任务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyChargeTaskList: {
			url: `/get/office/getMyChargeTaskList`,
			name: "获取负责和督查的任务",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getTaskAllocationList: {
			url: `/get/office/getTaskAllocationList`,
			name: "获取所有待分配子任务列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertTaskGanttLink: {
			url: `/set/office/insertTaskGanttLink`,
			name: "创建关联",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteTaskGanttLink: {
			url: `/set/office/deleteTaskGanttLink`,
			name: "删除关联关系",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateTaskGanttLink: {
			url: `/set/office/updateTaskGanttLink`,
			name: "更新子任务路径",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getAssignmentTaskList: {
			url: `/get/office/getAssignmentTaskList`,
			name: "获取待分解任务列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertTaskGanttData: {
			url: `/set/office/insertTaskGanttData`,
			name: "创建子任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteTaskGanttData: {
			url: `/set/office/deleteTaskGanttData`,
			name: "删除子任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateTaskGanttData: {
			url: `/set/office/updateTaskGanttData`,
			name: "更新子任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertTask: {
			url: `/set/office/insertTask`,
			name: "创建任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteTask: {
			url: `/set/office/deleteTask`,
			name: "删除任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteTaskByIds: {
			url: `/set/office/deleteTaskByIds`,
			name: "批量删除任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateTask: {
			url: `/set/office/updateTask`,
			name: "更新任务",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateTaskStatus:{
			url: `/set/office/updateTaskStatus`,
			name: "更新任务状态",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		searchTaskList: {
			url: `/get/office/searchTaskList`,
			name: "任务查询",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getManageTaskList: {
			url: `/get/office/getManageTaskList`,
			name: "获取任务列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyTaskProcessList: {
			url: `/get/office/getMyTaskProcessList`,
			name: "获取子任务的处理过程列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
	},
	vehicle: {
		getVehicleReturnList: {
			url: `/get/office/getVehicleReturnList`,
			name: "获取待还车记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getVehicleApprovalResult: {
			url: `/get/office/getVehicleApprovalResult`,
			name: "获取审批结果",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getVehicleOperatorUserList: {
			url: `/get/office/getVehicleOperatorUserList`,
			name: "获取调度人员列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		setVehicleOperator: {
			url: `/set/office/setVehicleOperator`,
			name: "设置调度员",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getVehicleOperatorByOrgId: {
			url: `/get/office/getVehicleOperatorByOrgId`,
			name: "获取申请记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getVehicleApprovedList: {
			url: `/get/office/getVehicleApprovedList`,
			name: "获取车辆申请审批列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getVehicleApplyList: {
			url: `/get/office/getVehicleApplyList`,
			name: "获取申请记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		setReturnVehicle: {
			url: `/set/office/setReturnVehicle`,
			name: "车辆归还",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		setApprovalStatus: {
			url: `/set/office/setApprovalStatus`,
			name: "调度员审批",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertVehicleApply: {
			url: `/set/office/insertVehicleApply`,
			name: "车辆使用申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateVehicleApply: {
			url: `/set/office/updateVehicleApply`,
			name: "更新车辆使用申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleApply: {
			url: `/set/office/deleteVehicleApply`,
			name: "删除车辆使用申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getVehicleRepairUserList: {
			url: `/get/office/getVehicleRepairUserList`,
			name: "获取维修经办人列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getVehicleRepairRecordList: {
			url: `/get/office/getVehicleRepairRecordList`,
			name: "获取维修列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertVehicleRepairRecord: {
			url: `/set/office/insertVehicleRepairRecord`,
			name: "添加车辆维护记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleRepairRecordByIds: {
			url: `/set/office/deleteVehicleRepairRecordByIds`,
			name: "批量删除车辆维护记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleRepairRecord: {
			url: `/set/office/deleteVehicleRepairRecord`,
			name: "删除车辆维护记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateVehicleRepairRecord: {
			url: `/set/office/updateVehicleRepairRecord`,
			name: "更新车辆维护记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getVehicleListForSelect: {
			url: `/get/office/getVehicleListForSelect`,
			name: "获取车辆下拉列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getManageVehicleInfoList: {
			url: `/get/office/getManageVehicleInfoList`,
			name: "获取车辆列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertVehicleInfo: {
			url: `/set/office/insertVehicleInfo`,
			name: "添加车辆信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleInfoByIds: {
			url: `/set/office/deleteVehicleInfoByIds`,
			name: "批量删除车辆信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleInfo: {
			url: `/set/office/deleteVehicleInfo`,
			name: "删除车辆信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateVehicleInfo: {
			url: `/set/office/updateVehicleInfo`,
			name: "更新车辆信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getVehicleDriverList: {
			url: `/get/office/getVehicleDriverList`,
			name: "获取司机列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insertVehicleDriver: {
			url: `/set/office/insertVehicleDriver`,
			name: "添加司机信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleDriver: {
			url: `/set/office/deleteVehicleDriver`,
			name: "删除司机信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateVehicleDriver: {
			url: `/set/office/updateVehicleDriver`,
			name: "更新司机信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getVehicleDriverListForSelect: {
			url: `/get/office/getVehicleDriverListForSelect`,
			name: "获取可调度车辆",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getCanUsedVehicleList: {
			url: `/get/office/getCanUsedVehicleList`,
			name: "获取可调度车辆",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getCanUsedOilCardList: {
			url: `/get/office/getCanUsedOilCardList`,
			name: "获取油卡列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getVehicleOilCardList: {
			url: `/get/office/getVehicleOilCardList`,
			name: "获取可通的油卡列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertVehicleOilCard: {
			url: `/set/office/insertVehicleOilCard`,
			name: "添加油卡信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleOilCard: {
			url: `/set/office/deleteVehicleOilCard`,
			name: "删除油卡信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteVehicleOilCardByIds: {
			url: `/set/office/deleteVehicleOilCardByIds`,
			name: "批量删除油卡信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateVehicleOilCard: {
			url: `/set/office/updateVehicleOilCard`,
			name: "更新油卡信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
	},
	fixed: {
		getFixedAssetsRepairList: {
			url: `/get/office/getFixedAssetsRepairList`,
			name: "获取维修列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		addFixedAssetsAllocation: {
			url: `/set/office/addFixedAssetsAllocation`,
			name: "资产调拨",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertFixedAssetsRepair: {
			url: `/set/office/insertFixedAssetsRepair`,
			name: "发起维修",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateFixedAssetsRepair: {
			url: `/set/office/updateFixedAssetsRepair`,
			name: "更新维修记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssetsRepairByIds: {
			url: `/set/office/deleteFixedAssetsRepairByIds`,
			name: "批量删除维修记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssetsRepair: {
			url: `/set/office/deleteFixedAssetsRepair`,
			name: "删除维修记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getFixedAssetsAllocationOldList: {
			url: `/get/office/getFixedAssetsAllocationOldList`,
			name: "获取历史调拨记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAllocationList: {
			url: `/get/office/getAllocationList`,
			name: "获取调拨列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getFixedAssetsApplyList: {
			url: `/get/office/getFixedAssetsApplyList`,
			name: "获取申请列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getFixedAssetsApplyOldList: {
			url: `/get/office/getFixedAssetsApplyOldList`,
			name: "获取历史申请列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		approvalFixedAssetsApply: {
			url: `/set/office/approvalFixedAssetsApply`,
			name: "固定资产申请审批",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertFixedAssetsApply: {
			url: `/set/office/insertFixedAssetsApply`,
			name: "发起申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateFixedAssetsApply: {
			url: `/set/office/updateFixedAssetsApply`,
			name: "更新申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssetsApply: {
			url: `/set/office/deleteFixedAssetsApply`,
			name: "删除申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertFixedAssets: {
			url: `/set/office/insertFixedAssets`,
			name: "添加固定资产记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		importAssetsFixedInfo: {
			url: `/set/office/importAssetsFixedInfo`,
			name: "批量导入固定资产",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateFixedAssets: {
			url: `/set/office/updateFixedAssets`,
			name: "更新固定资产",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssetsByIds: {
			url: `/set/office/deleteFixedAssetsByIds`,
			name: "批量删除固定资产记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		setRecoverFixedAssetsById: {
			url: `/set/office/setRecoverFixedAssetsById`,
			name: "收回固定资产",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssets: {
			url: `/set/office/deleteFixedAssets`,
			name: "删除固定资产记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getApplyFixedAssetsList: {
			url: `/get/office/getApplyFixedAssetsList`,
			name: "获取可申请的固定资产列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		queryFixedAssetsList: {
			url: `/get/office/queryFixedAssetsList`,
			name: "查询固定资产列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getFixedAssetsList: {
			url: `/get/office/getFixedAssetsList`,
			name: "获取固定资产列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getFixedAssetsById: {
			url: `/get/office/getFixedAssetsById`,
			name: "获取固定资产详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertFixedAssetsSort: {
			url: `/set/office/insertFixedAssetsSort`,
			name: "创建固定资产的分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateFixedAssetsSort: {
			url: `/set/office/updateFixedAssetsSort`,
			name: "更新固定资产的分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssetsSort: {
			url: `/set/office/deleteFixedAssetsSort`,
			name: "删除固定资产的分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getFixedAssetsSortTree: {
			url: `/get/office/getFixedAssetsSortTree`,
			name: "获取固定资产的分类",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insertFixedAssetsStorage: {
			url: `/set/office/insertFixedAssetsStorage`,
			name: "创建仓库",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteFixedAssetsStorage: {
			url: `/set/office/deleteFixedAssetsStorage`,
			name: "删除仓库",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateFixedAssetsStorage: {
			url: `/set/office/updateFixedAssetsStorage`,
			name: "更新仓库信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getAllFixedAssetsStorageList: {
			url: `/get/office/getAllFixedAssetsStorageList`,
			name: "获取所有仓库列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getFixedAssetsStorageList: {
			url: `/get/office/getFixedAssetsStorageList`,
			name: "获取仓库列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	meeting: {
		getMeetingSignUserList:{
			url: `/get/office/getMeetingSignUserList`,
			name: "获取会议签到人员列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		setMeetingSign:{
			url: `/set/office/setMeetingSign`,
			name: "会议签到",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getMyMeetingListForApp: {
			url: `/get/office/getMyMeetingListForApp`,
			name: "获取移动端待办会议",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyMeetingListForDesk: {
			url: `/get/office/getMyMeetingListForDesk`,
			name: "获取桌面会议",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getMyMeetingList: {
			url: `/get/office/getMyMeetingList`,
			name: "获取当前用户待参加会议",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getNotNotesMeetingList: {
			url: `/get/office/getNotNotesMeetingList`,
			name: "获取没有会议纪要的会议列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getMeetingDeviceListName: {
			url: `/get/office/getMeetingDeviceListName`,
			name: "获取设备名称列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getApplyMeetingList: {
			url: `/get/office/getApplyMeetingList`,
			name: "获取待审批的会议列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyApplyMeetingList: {
			url: `/get/office/getMyApplyMeetingList`,
			name: "获取个人历史会议申请记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMeetingListByDayStr: {
			url: `/get/office/getMeetingListByDayStr`,
			name: "按日期获取当前会议室使用情况",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMeetingByDay: {
			url: `/get/office/getMeetingByDay`,
			name: "获取禁用的会议时间段",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyMeetingById: {
			url: `/get/office/getMyMeetingById`,
			name: "获取会议详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		cancelMeeting: {
			url: `/set/office/cancelMeeting`,
			name: "会议取消通知",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		sendMeetingMsg: {
			url: `/set/office/sendMeetingMsg`,
			name: "发送会议通知",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertMeeting: {
			url: `/set/office/insertMeeting`,
			name: "申请会议",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteMeeting: {
			url: `/set/office/deleteMeeting`,
			name: "撤销会议",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateMeeting: {
			url: `/set/office/updateMeeting`,
			name: "申请会议",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertMeetingNotes: {
			url: `/set/office/insertMeetingNotes`,
			name: "添加会议记要",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteMeetingNotes: {
			url: `/set/office/deleteMeetingNotes`,
			name: "删除会议记要",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteMeetingNotesByIds: {
			url: `/set/office/deleteMeetingNotesByIds`,
			name: "批量删除会议记要",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateMeetingNotes: {
			url: `/set/office/updateMeetingNotes`,
			name: "删除会议记要",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getMyMeetingNotesListForDesk: {
			url: `/get/office/getMyMeetingNotesListForDesk`,
			name: "获取桌面会议记要",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		queryMeetingNotesList: {
			url: `/get/office/queryMeetingNotesList`,
			name: "会议记要查询",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMeetingNotesList: {
			url: `/get/office/getMeetingNotesList`,
			name: "获取会议记要列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertMeetingDevice: {
			url: `/set/office/insertMeetingDevice`,
			name: "添加会议室设备",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteMeetingDevice: {
			url: `/set/office/deleteMeetingDevice`,
			name: "删除会议室设备",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateMeetingDevice: {
			url: `/set/office/updateMeetingDevice`,
			name: "更新设备信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getMeetingDeviceList: {
			url: `/get/office/getMeetingDeviceList`,
			name: "获取会议设备列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMeetingRoomList: {
			url: `/get/office/getMeetingRoomList`,
			name: "会议室列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getCanUseDeviceList: {
			url: `/get/office/getCanUseDeviceList`,
			name: "获取权限内可用的会议室设备",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getMyApplyMeetingRoomList: {
			url: `/get/office/getMyApplyMeetingRoomList`,
			name: "获取我历史申请过的会议室列表",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getCanUseMeetingRoomList: {
			url: `/get/office/getCanUseMeetingRoomList`,
			name: "获取当前用户可用的会议室",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		insertMeetingRoom: {
			url: `/set/office/insertMeetingRoom`,
			name: "添加会议室",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateMeetingRoom: {
			url: `/set/office/updateMeetingRoom`,
			name: "更新会议室",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteMeetingRoom: {
			url: `/set/office/deleteMeetingRoom`,
			name: "删除会议室",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		}

	},
	officeSupplies: {
		insertOfficeSuppliesGrant: {
			url: `/set/office/insertOfficeSuppliesGrant`,
			name: "添加发放记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getMyApplyOfficeSuppliesList: {
			url: `/get/office/getMyApplyOfficeSuppliesList`,
			name: "获取个人历史申请记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getGrantOfficeList: {
			url: `/get/office/getGrantOfficeList`,
			name: "获取办公用品发放列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getGrantOfficeSuppliesList: {
			url: `/get/office/getGrantOfficeSuppliesList`,
			name: "待发放用品列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getOfficeSuppliesApplyRecordList: {
			url: `/get/office/getOfficeSuppliesApplyRecordList`,
			name: "获取审批列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertOfficeSuppliesApply: {
			url: `/set/office/insertOfficeSuppliesApply`,
			name: "发起申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteOfficeSuppliesApply: {
			url: `/set/office/deleteOfficeSuppliesApply`,
			name: "删除申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateOfficeSuppliesApply: {
			url: `/set/office/updateOfficeSuppliesApply`,
			name: "更新申请",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		approvalOfficeSuppliesApply: {
			url: `/set/office/approvalOfficeSuppliesApply`,
			name: "领用物资申请审批",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		insertOfficeSupplies: {
			url: `/set/office/insertOfficeSupplies`,
			name: "录入物资信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteOfficeSupplies: {
			url: `/set/office/deleteOfficeSupplies`,
			name: "删除物资信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteOfficeSuppliesByIds: {
			url: `/set/office/deleteOfficeSuppliesByIds`,
			name: "批量删除物资信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateOfficeSupplies: {
			url: `/set/office/updateOfficeSupplies`,
			name: "更新物资信息",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		importOfficeSuppliesInfo: {
			url: `/set/office/importOfficeSuppliesInfo`,
			name: "批量导入物资",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getApplyOfficeSuppliesList: {
			url: `/get/office/getApplyOfficeSuppliesList`,
			name: "获取可以领用的办公用品列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getOfficeSuppliesListBySortId: {
			url: `/get/office/getOfficeSuppliesListBySortId`,
			name: "按分类获取物资列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertOfficeSuppliesSort: {
			url: `/set/office/insertOfficeSuppliesSort`,
			name: "创建物资分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteOfficeSuppliesSort: {
			url: `/set/office/deleteOfficeSuppliesSort`,
			name: "删除物资分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateOfficeSuppliesSort: {
			url: `/set/office/updateOfficeSuppliesSort`,
			name: "更新物资分类",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getOfficeSuppliesSortTree: {
			url: `/get/office/getOfficeSuppliesSortTree`,
			name: "获取办公用品分类",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		}
	},
	diary: {
		getMyDiaryCount: {
			url: `/get/office/getMyDiaryCount`,
			name: "获取个人日志总数",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getMyDiaryListForApp: {
			url: `/get/office/getMyDiaryListForApp`,
			name: "获取个人工作日志列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDiaryCommentsList: {
			url: `/get/office/getDiaryCommentsList`,
			name: "获取日志评论",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertDiaryComments: {
			url: `/set/office/insertDiaryComments`,
			name: "添加日志评论",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteDiaryComments: {
			url: `/set/office/deleteDiaryComments`,
			name: "删除日志评论",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getShareDiaryUserList: {
			url: `/get/office/getShareDiaryUserList`,
			name: "获取共享人员列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getShareDiaryList: {
			url: `/get/office/getShareDiaryList`,
			name: "获取他人分享的工作日志",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMySubordinatesDiaryList: {
			url: `/get/office/getShareDiaryList`,
			name: "获取下属的工作日志",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyDiaryList: {
			url: `/get/office/getMyDiaryList`,
			name: "获取当前用户的历史工作日志",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getDiaryConfig: {
			url: `/get/office/getDiaryConfig`,
			name: "获取工作日志配置",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyDiaryById: {
			url: `/get/office/getMyDiaryById`,
			name: "获取工作日志详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		setDiaryConfig: {
			url: `/set/office/setDiaryConfig`,
			name: "设置工作日志权限",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		createDiary: {
			url: `/set/office/createDiary`,
			name: "创建工作日志",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteDiary: {
			url: `/set/office/deleteDiary`,
			name: "删除工作日志",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateDiary: {
			url: `/set/office/updateDiary`,
			name: "工作日志更新",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		}
	},
	attend: {
		insertAttend: {
			url: `/set/office/insertAttend`,
			name: "添加考勤记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getTotalAttendList: {
			url: `/get/office/getTotalAttendList`,
			name: "获取考勤列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyAttendYear: {
			url: `/get/office/getMyAttendYear`,
			name: "获取个人考勤的全部年份",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getMyAttendList: {
			url: `/get/office/getMyAttendList`,
			name: "获取个人考勤",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyOutAttendList: {
			url: `/get/office/getMyOutAttendList`,
			name: "获取外出列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyLeaveList: {
			url: `/get/office/getMyLeaveList`,
			name: "获取人员请假列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyTravelList: {
			url: `/get/office/getMyLeaveList`,
			name: "获取出差列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyDutyList: {
			url: `/get/office/getMyLeaveList`,
			name: "获取值班列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyOverTimeList: {
			url: `/get/office/getMyOverTimeList`,
			name: "获取加班列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getAttendStatusDay: {
			url: `/get/office/getAttendStatusDay`,
			name: "获取个人上班考勤是否打卡",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getAttendByCreateUser: {
			url: `/get/office/getAttendByCreateUser`,
			name: "获取当天打卡信息",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getBeOnABusinessTrip: {
			url: `/get/office/getBeOnABusinessTrip`,
			name: "获取当天是否有外出或者出差申请",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getOffWorkAttendStatusDay: {
			url: `/get/office/getOffWorkAttendStatusDay`,
			name: "获取个人下班考勤是否打卡",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getExpAttendRecord: {
			url: `/get/office/getExpAttendRecord`,
			name: "导出打卡记录详情",
			fileDownload: async function (data) {
				return await http.fileDownload(this.url, data, {
					headers: {}
				})
			}
		},
		getExpAttendRecord2: {
			url: `/get/office/getExpAttendRecord2`,
			name: "导出打卡记录汇总",
			fileDownload: async function (data) {
				return await http.fileDownload(this.url, data, {
					headers: {}
				})
			}
		},
		getMyAttendListForApp: {
			url: `/get/office/getMyAttendListForApp`,
			name: "获取移动端考勤记录",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	workPlan: {
		getMyWorkPlanListForApp: {
			url: `/get/office/getMyWorkPlanListForApp`,
			name: "移动端我参与的工作计划",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyWorkPlanList: {
			url: `/get/office/getMyWorkPlanList`,
			name: "我参与的工作计划",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyWorkPlanForDesk: {
			url: `/get/office/getMyWorkPlanForDesk`,
			name: "获取个人工作计划",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getHoldWorkPlanList: {
			url: `/get/office/getHoldWorkPlanList`,
			name: "我负责的计划列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getSupWorkPlanList: {
			url: `/get/office/getSupWorkPlanList`,
			name: "我督查的计划列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertWorkPlan: {
			url: `/set/office/insertWorkPlan`,
			name: "创建工作计划",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteWorkPlan: {
			url: `/set/office/deleteWorkPlan`,
			name: "删除工作计划",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteWorkPlanByIds: {
			url: `/set/office/deleteWorkPlanByIds`,
			name: "批量删除工作计划",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateWorkPlan: {
			url: `/set/office/updateWorkPlan`,
			name: "更新工作计划",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getWorkPlanProcessList: {
			url: `/get/office/getWorkPlanProcessList`,
			name: "获取工作计划处理反馈列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertWorkPlanProcess: {
			url: `/set/office/insertWorkPlanProcess`,
			name: "添加计划完成情况",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteWorkPlanProcess: {
			url: `/set/office/deleteWorkPlanProcess`,
			name: "删除工作计划处理结果",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateWorkPlanProcess: {
			url: `/set/office/updateWorkPlanProcess`,
			name: "更新工作计划处理结果",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		getManageWorkPlanList: {
			url: `/get/office/getManageWorkPlanList`,
			name: "获取工作维护列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getMyWorkPlanById: {
			url: `/get/office/getMyWorkPlanById`,
			name: "获取工作计划详情",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		}
	},
	entertain:{
		getMyEntertainListForDesk:{
			url: `/get/office/getMyEntertainListForDesk`,
			name: "获取桌面待办招待事件",
			get: async function () {
				return await http({
					url: this.url,
					method: 'GET'
				});
			}
		},
		getEntertainListForSearch:{
			url: `/get/office/getEntertainListForSearch`,
			name: "查询招待事件列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getEntertainListForApprove:{
			url: `/get/office/getEntertainListForApprove`,
			name: "获取待审批事件",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		getEntertainListForManage:{
			url: `/get/office/getEntertainListForManage`,
			name: "获取接待事件列表",
			get: async function (params) {
				return await http({
					url: this.url,
					method: 'GET',
					params: params
				});
			}
		},
		insertEntertain: {
			url: `/set/office/insertEntertain`,
			name: "创建招待记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteEntertain: {
			url: `/set/office/deleteEntertain`,
			name: "删除招待记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		deleteEntertainByIds: {
			url: `/set/office/deleteEntertainByIds`,
			name: "批量删除招待记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
		updateEntertain: {
			url: `/set/office/updateEntertain`,
			name: "更新招待记录",
			post: async function (data, config = {}) {
				// 转换数据为URL编码格式
				let formData = tansParams(data);
				formData = formData.slice(0, -1); // 移除末尾的&符号
				
				return await http({
					url: this.url,
					method: 'POST',
					data: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
			}
		},
	}
}
