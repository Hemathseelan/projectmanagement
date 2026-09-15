import Badge from '../common/Badge';
import { TASK_PRIORITY_STYLES } from '../../utils/constants';

export default function TaskPriorityBadge({ priority }) {
  return <Badge className={TASK_PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-700'}>{priority}</Badge>;
}
