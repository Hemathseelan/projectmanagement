import Badge from '../common/Badge';
import { TASK_STATUS_STYLES } from '../../utils/constants';

export default function TaskStatusBadge({ status }) {
  return <Badge className={TASK_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>;
}
